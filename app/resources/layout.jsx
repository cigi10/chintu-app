import ResourceTagsAuto from "@/components/ResourceTagsAuto";

// Wraps every /resources page (the index, each of the 101 hand-written
// resource pages, and the tag-browse pages) so ResourceTagsAuto can
// inject a tags chip row under any individual resource page without
// editing each one - see ResourceTagsAuto's own comment for why that
// matters here specifically.
export default function ResourcesLayout({ children }) {
  return (
    <>
      {children}
      <ResourceTagsAuto />
    </>
  );
}
