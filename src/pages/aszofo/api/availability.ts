export const prerender = false;

import { stayLimits, unavailableRanges } from "../../../aszofo/bookings";
import { house, booking as rules } from "../../../aszofo/config";
import { todayAtHouse } from "../../../aszofo/dates";
import { guard, json } from "../../../aszofo/http";

export const GET = () =>
  guard(async () => {
    const today = todayAtHouse();
    const { first, last } = stayLimits(today);
    return json({
      today,
      first,
      last,
      minNights: rules.minNights,
      maxNights: rules.maxNights,
      maxGuests: house.maxGuests,
      unavailable: await unavailableRanges(today),
    });
  });
