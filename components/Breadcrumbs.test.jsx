import { render } from "@testing-library/react";
import Breadcrumbs from "./Breadcrumbs";
import { SITE_URL } from "@/lib/seo";

function schemaOf(container) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script.innerHTML);
}

describe("Breadcrumbs", () => {
  it("gives every schema ListItem an absolute item URL, current page included", () => {
    const { container } = render(
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Resources", href: "/resources" },
        { label: "Chain Rule", href: "/resources/chain-rule" },
      ]} />
    );
    const els = schemaOf(container).itemListElement;
    expect(els).toHaveLength(3);
    els.forEach((el, i) => {
      expect(el.position).toBe(i + 1);
      expect(el.item).toMatch(new RegExp(`^${SITE_URL}/`));
    });
    expect(els[2].item).toBe(`${SITE_URL}/resources/chain-rule`);
  });

  it("leaves href-less grouping levels out of the schema without position gaps", () => {
    const { container } = render(
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Math" },
        { label: "Chain Rule", href: "/resources/chain-rule" },
      ]} />
    );
    const els = schemaOf(container).itemListElement;
    expect(els.map(e => e.position)).toEqual([1, 2]);
    expect(els.every(e => e.item)).toBe(true);
  });
});
