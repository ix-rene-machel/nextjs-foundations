import { Suspense } from "react";

// With Cache Components, reading `params` for a route with no generateStaticParams
// is request-time work. It lives in a child behind <Suspense> so the shell can
// prerender.
export default function DocsPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <DocsContent params={props.params} />
    </Suspense>
  );
}

async function DocsContent({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await paramsPromise;

  // params.slug is an array of path segments
  const path = params.slug.join("/");

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">Documentation</h1>
      <p className="mb-2">Full path: /docs/{path}</p>
      <p className="mb-4">Segments: {params.slug.length}</p>
      <ul className="list-disc pl-6">
        {params.slug.map((segment, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: segments can repeat, index is the position in the path
          <li key={i}>
            Segment {i}: {segment}
          </li>
        ))}
      </ul>
    </div>
  );
}
