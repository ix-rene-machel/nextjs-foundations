"use server";

import { z } from "zod";

// Server-side validation: the client is never trusted. Client-side hints are
// optional UX; this schema is the source of truth.
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // Demo only: no database or mail provider in this repo. Logs the validated
    // payload so the action's effect is visible on the server.
    console.log("[contact] submitted:", {
      ...parsed.data,
      message: `${parsed.data.message.slice(0, 20)}…`,
    });
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("[contact] failed:", error);
    return { message: "Failed to send message. Please try again." };
  }
}
