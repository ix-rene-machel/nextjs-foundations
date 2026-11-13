export default async function ShopPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  // params.slug is undefined when no segments are present
  const categories = params.slug ?? [];
  const isRoot = categories.length === 0;

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">
        {isRoot ? "All Products" : "Filtered Products"}
      </h1>
      {isRoot ? (
        <p>Showing all categories</p>
      ) : (
        <div>
          <p className="mb-2">Category path: /{categories.join("/")}</p>
          <p className="mb-4">Depth: {categories.length}</p>
          <ul className="list-disc pl-6">
            {categories.map((category, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: segments can repeat, index is the position in the path
              <li key={i}>
                Level {i + 1}: {category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
