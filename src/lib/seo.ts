import { site } from "./site";

export type Seo = {
  title: string;
  description: string;
  canonicalUrl: string;
  image: string;
};

export function buildSeo({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Seo {
  const safeTitle = title ? `${title} | ${site.name}` : site.title;
  const safeDescription = description || site.description;
  const canonicalUrl = `${site.url}${path || ""}`;
  const ogPath =
    !path || path === "/" ? "/og/index.png" : `/og${path}.png`;
  const safeImage = `${site.url}${ogPath}`;

  return {
    title: safeTitle,
    description: safeDescription,
    canonicalUrl,
    image: safeImage,
  };
}
