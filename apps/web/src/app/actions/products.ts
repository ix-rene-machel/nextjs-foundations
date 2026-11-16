"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { saveProduct } from "@/lib/products";

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  inventory: z.coerce.number().int().min(0, "Inventory must be 0 or more"),
});

export type UpdateProductState = {
  success?: boolean;
  message?: string;
  errors?: { name?: string[]; price?: string[]; inventory?: string[] };
};

export async function updateProduct(
  _prev: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { id, ...data } = parsed.data;
  const ok = await saveProduct(id, data);
  if (!ok) return { message: "Product not found." };

  // The author must see their own write on the next render: expire immediately.
  updateTag(`product-${id}`);
  updateTag("products");

  return { success: true, message: "Product updated! Cache invalidated." };
}
