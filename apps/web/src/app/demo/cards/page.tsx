// Server Component - fetches data, renders heavy content

import { ExpandableWrapper } from "@/components/expandable-wrapper";

// Simulated products from database
const products = [
  {
    id: "1",
    name: "Widget Pro",
    description: "Professional-grade widget",
    price: 99,
  },
  {
    id: "2",
    name: "Gadget Plus",
    description: "Enhanced gadget features",
    price: 149,
  },
  {
    id: "3",
    name: "Tool Master",
    description: "Master your workflow",
    price: 199,
  },
];

export default function CardsDemoPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Server Children Pattern</h1>
        <p className="mt-2 text-muted-foreground">
          Heavy card content renders on server. Only the expand/collapse is
          client-side.
        </p>
      </div>

      {/* Client wrapper with server-rendered children */}
      <ExpandableWrapper title="Product Catalog">
        {/* These cards are Server Components - zero JS */}
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <h3 className="font-semibold">{product.name}</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                {product.description}
              </p>
              <p className="mt-2 font-mono text-lg">${product.price}</p>
            </div>
          ))}
        </div>
      </ExpandableWrapper>

      {/* Decision documentation */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Decision Rationale</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-sm">
          <li>
            <strong>ExpandableWrapper (Client):</strong> Uses useState for
            expand/collapse toggle
          </li>
          <li>
            <strong>Product Cards (Server):</strong> Static content, no
            interactivity, rendered as HTML
          </li>
          <li>
            <strong>Pattern:</strong> Server children stream through client
            wrapper untouched
          </li>
        </ul>
      </section>
    </main>
  );
}
