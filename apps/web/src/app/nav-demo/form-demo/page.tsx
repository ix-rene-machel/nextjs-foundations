import Link from "next/link";
import { DraftForm } from "./draft-form";

export default function FormDemoPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="font-bold text-2xl">Form State Demo</h1>
      <p className="text-gray-600 text-sm">
        Type something, open Page A with the link, then press the browser's back
        button.
      </p>
      <DraftForm />
      <div className="flex gap-4">
        <Link
          href="/nav-demo/page-a"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Soft nav to Page A
        </Link>
        <a
          href="/nav-demo/page-a"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Hard nav to Page A
        </a>
      </div>
    </main>
  );
}
