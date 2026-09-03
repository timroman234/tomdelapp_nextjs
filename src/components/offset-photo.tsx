// src/components/offset-photo.tsx
import Image from "next/image";
import type { ReactNode } from "react";

type OffsetPhotoProps = {
  src: string;
  alt: string;
  aspectRatio: string;
  offset: number;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
  children?: ReactNode;
};

export function OffsetPhoto({
  src,
  alt,
  aspectRatio,
  offset,
  objectPosition = "50% 50%",
  priority,
  sizes,
  children,
}: OffsetPhotoProps) {
  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      <span
        aria-hidden
        className="absolute inset-0 block bg-red"
        style={{ transform: `translate(${offset}px, ${offset}px)` }}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="relative object-cover"
        style={{ objectPosition }}
      />
      {children}
    </div>
  );
}
