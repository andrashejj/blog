import { type CollectionEntry, getCollection } from "astro:content";
import readingTime from "reading-time";

export type Post = CollectionEntry<"posts">;

export type PostMeta = Post["data"] & {
  year: string;
  month: string;
  readingTimeText: string;
  routePath: string;
  legacyRoutePath: string;
};

type Page = CollectionEntry<"pages">;

function getRouteParts(date: string) {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date "${date}". Expected ISO format YYYY-MM-DD.`);
  }

  const year = String(parsedDate.getUTCFullYear());
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");

  return { year, month };
}

function toMeta(post: Post): PostMeta {
  const { year, month } = getRouteParts(post.data.date);
  const rt = post.data.readingTime ?? readingTime(post.body).minutes;
  const readingTimeText = `${Math.max(1, Math.ceil(rt))} min read`;

  return {
    ...post.data,
    year,
    month,
    readingTimeText,
    routePath: `/blog/${post.data.slug}`,
    legacyRoutePath: `/blog/${year}/${month}/${post.data.slug}`,
  };
}

function assertUniqueSlugs(posts: Post[]) {
  const slugSet = new Set<string>();

  for (const post of posts) {
    if (slugSet.has(post.data.slug)) {
      throw new Error(
        `Duplicate slug "${post.data.slug}" found in content/posts`,
      );
    }

    slugSet.add(post.data.slug);
  }
}

export async function getAllPosts({
  includeDrafts = false,
}: {
  includeDrafts?: boolean;
} = {}): Promise<Post[]> {
  const posts = await getCollection(
    "posts",
    ({ data }: Post) => includeDrafts || !data.draft,
  );
  assertUniqueSlugs(posts);

  return posts.sort((a: Post, b: Post) => {
    const aTime = new Date(a.data.date).getTime();
    const bTime = new Date(b.data.date).getTime();
    return bTime - aTime;
  });
}

export async function getAllPostMeta(opts?: {
  includeDrafts?: boolean;
}): Promise<PostMeta[]> {
  const posts = await getAllPosts(opts);
  return posts.map(toMeta);
}

export async function getPostBySlug(
  slug: string,
  opts?: { includeDrafts?: boolean },
): Promise<{ post: Post; meta: PostMeta } | null> {
  const posts = await getAllPosts(opts);
  const found = posts.find((post: Post) => post.data.slug === slug);

  if (!found) {
    return null;
  }

  return {
    post: found,
    meta: toMeta(found),
  };
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const pages = await getCollection("pages");
  return (
    pages.find(
      (page: Page) =>
        page.id === slug ||
        page.id === `${slug}.md` ||
        page.id === `${slug}.mdx`,
    ) ?? null
  );
}
