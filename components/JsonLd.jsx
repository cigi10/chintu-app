// A single reusable way to embed a JSON-LD structured-data block. Server
// component (no "use client") so it costs nothing on the client bundle —
// it's just a <script type="application/ld+json"> tag.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
