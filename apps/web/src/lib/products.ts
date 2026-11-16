import { cacheLife, cacheTag } from "next/cache";

export type Product = {
  id: string;
  name: string;
  price: number;
  inventory: number;
};

// In-memory stand-in for a database (no real API or DB in this repo). It lives
// in the server process, so edits persist until the process restarts.
const store = new Map<string, Product>([
  ["123", { id: "123", name: "Widget Pro", price: 99, inventory: 40 }],
  ["456", { id: "456", name: "Gadget Plus", price: 149, inventory: 12 }],
  ["789", { id: "789", name: "Tool Master", price: 199, inventory: 0 }],
]);

// Counts real reads of the "database". A cache hit does not increment it, so the
// page can show whether the value came from the cache.
let reads = 0;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Uncached read, only used by the cached functions below and the write path. */
async function readProduct(id: string): Promise<Product | null> {
  await sleep(300); // simulated network/database latency
  reads += 1;
  return store.get(id) ?? null;
}

/** Cached per product id (the argument is part of the cache key). */
export async function getProduct(
  id: string
): Promise<{ product: Product | null; reads: number; readAt: string }> {
  "use cache";
  cacheLife("products"); // stale 5m, revalidate 15m, expire 1h (see next.config.ts)
  cacheTag("products", `product-${id}`);

  const product = await readProduct(id);
  return { product, reads, readAt: new Date().toISOString() };
}

/** Cached list. */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("products");
  cacheTag("products");

  await sleep(300);
  return [...store.values()];
}

/** Write path used by the Server Action. Not cached. */
export async function saveProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<boolean> {
  await sleep(100);
  const current = store.get(id);
  if (!current) return false;
  store.set(id, { ...current, ...data });
  return true;
}
