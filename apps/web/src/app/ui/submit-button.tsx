"use client";

import { useFormStatus } from "react-dom";

// useFormStatus only reads the parent <form>, so it must be rendered inside one.
export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {pending ? "Submitting..." : "Send Message"}
    </button>
  );
}
