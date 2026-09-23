import Link from "next/link";

/** Renders a list of tags as linked chips to `${basePath}/${tag}`. Shared
 *  between resource pages and blog posts so both use identical markup. */
export default function TagChips({ tags, basePath }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="tag-chips">
      {tags.map(tag => (
        <Link key={tag} href={`${basePath}/${tag}`} className="tag-chip">
          {tag}
        </Link>
      ))}
    </div>
  );
}
