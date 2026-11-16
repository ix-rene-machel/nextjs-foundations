"use client";

import { useActionState } from "react";
import { type UpdateProductState, updateProduct } from "@/app/actions/products";
import type { Product } from "@/lib/products";

const initial: UpdateProductState = {};

export function ProductForm({ product }: { product: Product }) {
  const [state, action, pending] = useActionState(updateProduct, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="id" value={product.id} />
      <div>
        <label htmlFor="name" className="mb-1 block font-medium text-sm">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={product.name}
          className="w-full rounded border px-3 py-2"
        />
        {state.errors?.name && (
          <p className="mt-1 text-red-600 text-sm">{state.errors.name[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="price" className="mb-1 block font-medium text-sm">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          defaultValue={product.price}
          className="w-full rounded border px-3 py-2"
        />
        {state.errors?.price && (
          <p className="mt-1 text-red-600 text-sm">{state.errors.price[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="inventory" className="mb-1 block font-medium text-sm">
          Inventory
        </label>
        <input
          id="inventory"
          name="inventory"
          type="number"
          defaultValue={product.inventory}
          className="w-full rounded border px-3 py-2"
        />
        {state.errors?.inventory && (
          <p className="mt-1 text-red-600 text-sm">
            {state.errors.inventory[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>

      {state.success && (
        <p className="text-green-600" aria-live="polite">
          {state.message}
        </p>
      )}
      {state.message && !state.success && (
        <p className="text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}
    </form>
  );
}
