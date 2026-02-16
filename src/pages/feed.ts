export function GET(context: {
  redirect: (path: string, status?: number) => Response;
}) {
  return context.redirect("/rss.xml", 308);
}
