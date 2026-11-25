"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function Gallery({ images, name }: { images: { url: string; alt: string | null }[]; name: string }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const go = (n: number) => {
    setI(n);
    const el = ref.current;
    if (el) el.scrollTo({ left: el.clientWidth * n, behavior: "smooth" });
  };
  if (!images.length) return <div className="gallery"><div className="slide" style={{ aspectRatio: 1, background: "#e5e5ea", borderRadius: 6 }} /></div>;
  return (
    <div className="gallery">
      <div
        className="slides"
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setI(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {images.map((img, n) => (
          <div className="slide" key={img.url}>
            <Image src={img.url} alt={img.alt || `${name}, image ${n + 1}`} fill sizes="(min-width:900px) 50vw, 100vw" priority={n === 0} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="dots">
            {images.map((_, n) => (
              <button key={n} aria-label={`Image ${n + 1}`} aria-current={n === i} onClick={() => go(n)} />
            ))}
          </div>
          <div className="thumbs">
            {images.map((img, n) => (
              <button key={img.url} aria-label={`Show image ${n + 1}`} aria-current={n === i} onClick={() => go(n)}>
                <Image src={img.url} alt="" width={74} height={74} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
