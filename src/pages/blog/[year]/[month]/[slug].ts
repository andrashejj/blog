import type { APIRoute } from "astro";

import { getAllPostMeta } from "../../../../lib/content";
import type { PostMeta } from "../../../../lib/content";

export async function getStaticPaths() {
  const posts = await getAllPostMeta();

  return posts.map((post: PostMeta) => ({
    params: {
      year: post.year,
      month: post.month,
      slug: post.slug,
    },
  }));
}

export const GET: APIRoute = async ({ params, redirect }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response("Not Found", { status: 404 });
  }

  return redirect(`/blog/${slug}`, 301);
};
