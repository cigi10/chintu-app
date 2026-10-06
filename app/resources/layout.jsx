import ResourceTagsAuto from "@/components/ResourceTagsAuto";
import AdSenseScript from "@/components/AdSenseScript";

// Wraps every /resources page (the index, each of the 101 hand-written
// resource pages, and the tag-browse pages) so ResourceTagsAuto can
// inject a tags chip row under any individual resource page without
// editing each one - see ResourceTagsAuto's own comment for why that
// matters here specifically. It also loads AdSense, which is limited to
// /blog and /resources (see components/AdSenseScript.tsx).
export default function ResourcesLayout({ children }) {
  return (
    <>
      {children}
      <ResourceTagsAuto />
      <AdSenseScript />
    </>
  );
}
