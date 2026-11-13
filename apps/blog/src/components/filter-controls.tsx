'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Props = { categories: string[] };

// Client Component: reads the current query with useSearchParams and writes a
// new URL with useRouter. Every change starts from the current params, so
// unrelated filters survive.
export function FilterControls({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';
  const currentSort = searchParams.get('sort') ?? '';

  const update = useCallback(
    (name: 'category' | 'sort', value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const chip = (label: string, value: string) => {
    const active =
      currentCategory.toLowerCase() === value.toLowerCase() ||
      (value === '' && !currentCategory);
    return (
      <button
        key={label}
        type="button"
        aria-pressed={active}
        onClick={() => update('category', value)}
        className={`rounded px-3 py-1 text-sm ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap gap-2">
        {chip('All', '')}
        {categories.map((c) => chip(c, c))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        Sort
        <select
          value={currentSort === 'title' ? 'title' : 'date'}
          onChange={(e) =>
            update('sort', e.target.value === 'title' ? 'title' : '')
          }
          className="rounded border px-2 py-1"
        >
          <option value="date">Newest</option>
          <option value="title">Title A–Z</option>
        </select>
      </label>

      {(currentCategory || currentSort) && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-red-600 text-sm hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
