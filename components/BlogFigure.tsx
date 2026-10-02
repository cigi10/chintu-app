import Image from "next/image";
import { BLOG_FIGURES } from "@/components/blog-figures";

export type BlogFigureData = { name: string; caption?: string };
// maxWidth (px) keeps tall screenshots from filling the whole column.
export type BlogImageData = { src: string; alt: string; width: number; height: number; caption?: string; maxWidth?: number };

// A named inline-SVG figure (see components/blog-figures/index.tsx).
export function BlogFigure({ figure }: { figure: BlogFigureData }) {
  const render = BLOG_FIGURES[figure.name];
  if (!render) return null;
  return (
    <figure className="blog-fig">
      {render()}
      {figure.caption && <figcaption className="blog-fig-caption">{figure.caption}</figcaption>}
    </figure>
  );
}

// A screenshot or other image from /public, at its natural aspect ratio,
// scaled down to the post column.
export function BlogImage({ image }: { image: BlogImageData }) {
  return (
    <figure className="blog-fig">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 820px) 100vw, 772px"
        className="blog-fig-image"
        style={image.maxWidth ? { maxWidth: image.maxWidth, margin: "0 auto" } : undefined}
      />
      {image.caption && <figcaption className="blog-fig-caption">{image.caption}</figcaption>}
    </figure>
  );
}
