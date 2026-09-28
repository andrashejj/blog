import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const vitePath = require.resolve("vite", {
  paths: [dirname(require.resolve("astro/package.json"))],
});
const { createServer } = await import(vitePath);
// No project config, credentials or live storage are loaded by this suite.
const server = await createServer({
  configFile: false,
  envDir: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: "custom",
});
const pricing = await server.ssrLoadModule("/src/aszofo/costs.ts");
const bookings = await server.ssrLoadModule("/src/aszofo/bookings.ts");
const { store } = await server.ssrLoadModule("/src/aszofo/store.ts");
const { costs } = await server.ssrLoadModule("/src/aszofo/config.ts");
const emails = await server.ssrLoadModule("/src/aszofo/email.ts");
const { dict } = await server.ssrLoadModule("/src/aszofo/i18n.ts");
const today = "2026-09-28";
const base = {
  checkIn: "2026-10-01",
  checkOut: "2026-10-04",
  name: "Test Guest",
  email: "test@example.invalid",
  adults: 2,
  children: 0,
  lang: "en",
  keys: "hunor",
};
const compact = (s) => s.replace(/\s/g, "");

try {
  await test("nightly tiers, seasonal keys, and fees are calculated once", () => {
    assert.equal(
      pricing.quoteStay(base.checkIn, base.checkOut, "regular").total,
      810,
    );
    const friends = pricing.quoteStay(
      base.checkIn,
      base.checkOut,
      "friends",
      "budapest",
    );
    assert.equal(friends.nightly, 25);
    assert.equal(friends.accommodation, 75);
    assert.equal(friends.keys, 20); // Winter cannot bypass the key holder.
    assert.equal(friends.total, 135);
    assert.equal(
      pricing.quoteStay("2027-05-01", "2027-05-04", "friends", "budapest")
        .total,
      115,
    );
    assert.equal(
      pricing.quoteStay("2027-09-29", "2027-10-02", "regular", "hunor").total,
      810,
    );
  });
  await test("Hungarian uses fixed HUF prices; English and German use euros", () => {
    assert.equal(compact(pricing.money(25, "hu")), "10000Ft");
    assert.equal(compact(pricing.money(250, "hu")), "100000Ft");
    assert.equal(compact(pricing.money(135, "hu")), "54000Ft");
    assert.equal(pricing.money(25, "en"), "€25");
    assert.equal(compact(pricing.money(250, "de")), "250€");
    for (const lang of ["en", "hu", "de"]) {
      assert.ok(dict(lang).costs.rateNote);
      assert.ok(dict(lang).costs.noPayment);
    }
  });
  await test("server ignores supplied prices and donations; defaults to regular rate", () => {
    const result = bookings.parseRequest(
      { ...base, pricing: { total: 1 }, thanks: 99 },
      today,
    );
    assert.equal(result.ok, true);
    assert.equal(result.value.pricing.total, 810);
    assert.equal(result.value.thanks, 0);
    assert.equal(result.value.guestType, "regular");
    assert.equal(
      bookings.parseRequest({ ...base, guestType: "unknown" }, today).value
        .pricing.total,
      810,
    );
    assert.equal(
      bookings.parseRequest({ ...base, guestType: "friends" }, today).value
        .pricing.total,
      135,
    );
    assert.equal(
      bookings.parseRequest({ ...base, checkOut: base.checkIn }, today).ok,
      false,
    );
  });
  await test("saved quote survives round-trip and rate changes; legacy requests retain fees", async () => {
    const hashes = new Map();
    store.hset = async (key, field, value) => {
      hashes.set(`${key}:${field}`, value);
    };
    store.hget = async (key, field) => hashes.get(`${key}:${field}`) ?? null;
    const parsed = bookings.parseRequest(
      { ...base, guestType: "friends", lang: "hu" },
      today,
    );
    const created = await bookings.createBooking(parsed.value);
    const saved = await bookings.getBookingByToken(created.token);
    assert.equal(saved.guestType, "friends");
    assert.equal(saved.pricing.total, 135);
    const original = costs.nightly.friends;
    try {
      costs.nightly.friends = 50;
      assert.equal(pricing.costsFor(saved).nightly, 25);
      assert.equal(pricing.costsFor(saved).total, 135);
    } finally {
      costs.nightly.friends = original;
    }
    assert.equal(
      pricing.costsFor({ checkIn: base.checkIn, keys: "hunor", thanks: 30 })
        .total,
      90,
    );
  });
  await test("guest receipts and host notices contain the saved rate and total", async () => {
    const sent = [];
    const originalFetch = globalThis.fetch;
    const previousKey = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "test-placeholder";
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://api.resend.com/emails");
      sent.push(JSON.parse(init.body));
      return new Response("{}", { status: 200 });
    };
    try {
      const parsed = bookings.parseRequest(
        { ...base, guestType: "friends", lang: "hu" },
        today,
      );
      const b = {
        ...parsed.value,
        id: "test",
        token: "test-token",
        status: "pending",
      };
      assert.equal(
        await emails.sendReceived("https://example.invalid", b),
        true,
      );
      assert.match(compact(sent[0].text), /54000Ft/);
      assert.match(compact(sent[0].text), /3×10000Ft=30000Ft/);
      assert.equal(
        await emails.sendNewRequestToHost("https://example.invalid", b),
        true,
      );
      assert.match(sent[1].text, /Friends & family/);
      assert.match(sent[1].text, /€135/);
      assert.equal(
        await emails.sendApproved("https://example.invalid", b, {
          name: "Test Host",
          email: "host@example.invalid",
        }),
        true,
      );
      assert.match(compact(sent[2].text), /54000Ft/);
    } finally {
      globalThis.fetch = originalFetch;
      if (previousKey === undefined) process.env.RESEND_API_KEY = undefined;
      else process.env.RESEND_API_KEY = previousKey;
    }
  });
} finally {
  await server.close();
}
