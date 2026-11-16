import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/products/product-form";
import { getProduct } from "@/lib/products";

// Validate that navigating into this route is instant (dev-time warning if a
// <Suspense> boundary is missing). Requires cacheComponents.
export const instant = true;

// Static shell: header + footer prerender. The two subtrees below are separate
// Suspense holes with different freshness: one cached, one request-time.
export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <header>
        <h1 className="font-bold text-3xl">Product Details</h1>
      </header>

      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>

      <footer className="border-t pt-4 text-gray-500 text-sm">ACME Corp</footer>
    </div>
  );
}

async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Cached: cacheLife('products') + tags `products`, `product-<id>`.
  const { product, reads, readAt } = await getProduct(id);
  if (!product) notFound();

  return (
    <>
      <section className="rounded-lg border p-4">
        <h2 className="font-semibold text-xl">{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>In Stock: {product.inventory}</p>
        <p className="mt-3 font-mono text-gray-500 text-xs">
          cache entry read #{reads} at {readAt}
        </p>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 font-semibold text-xl">Edit product</h2>
        <ProductForm product={product} />
      </section>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="h-6 w-32 rounded bg-gray-200" />
      <div className="h-6 w-24 rounded bg-gray-200" />
    </div>
  );
}
