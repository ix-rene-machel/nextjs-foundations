import Image from "next/image";

const images = [
  { src: "https://picsum.photos/800/600?random=1", alt: "Mountain landscape" },
  { src: "https://picsum.photos/800/600?random=2", alt: "Ocean sunset" },
  { src: "https://picsum.photos/800/600?random=3", alt: "Forest path" },
  { src: "https://picsum.photos/800/600?random=4", alt: "City skyline" },
];

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 font-bold text-3xl">Photo Gallery</h1>

      {/* Hero: likely LCP element, so preload it. Fill + aspect ratio reserves space. */}
      <div className="relative mb-8 aspect-video w-full">
        <Image
          src="https://picsum.photos/1200/600?random=hero"
          alt="Featured landscape"
          fill
          preload
          quality={85}
          sizes="(max-width: 896px) 100vw, 896px"
          className="rounded-lg object-cover"
        />
      </div>

      {/* Two columns: each image is half the content width on small screens and
          a fixed 400px card on wide screens (the container is max-w-4xl). */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.src} className="relative aspect-[4/3]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={80}
              sizes="(max-width: 768px) 50vw, 400px"
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>

      <section className="mt-8 rounded bg-gray-100 p-4">
        <h2 className="mb-2 font-semibold">Image Optimizations Applied</h2>
        <ul className="list-inside list-disc text-gray-600 text-sm">
          <li>Served from /_next/image in AVIF or WebP</li>
          <li>Hero preloaded (LCP candidate)</li>
          <li>sizes match the 2-column layout (no over-fetching)</li>
          <li>fill + aspect ratio reserves space (no layout shift)</li>
          <li>Below-fold images lazy load</li>
        </ul>
      </section>
    </main>
  );
}
