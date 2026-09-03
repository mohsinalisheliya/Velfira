import { useMemo } from "react";

export default function VariantSelector({ variants, selectedVariant, onSelect }) {
  // Collect unique attribute keys across all variants (e.g. metal, size, weight)
  const attributeGroups = useMemo(() => {
    const groups = {};
    variants.forEach((v) => {
      Object.entries(v.attributes || {}).forEach(([key, value]) => {
        if (!groups[key]) groups[key] = new Set();
        groups[key].add(value);
      });
    });
    return Object.fromEntries(
      Object.entries(groups).map(([key, set]) => [key, Array.from(set)])
    );
  }, [variants]);

  if (variants.length === 0) return null;

  const selectedAttrs = selectedVariant?.attributes || {};

  const pickAttribute = (key, value) => {
    const nextAttrs = { ...selectedAttrs, [key]: value };
    // Find a variant that matches all currently chosen attributes
    const match = variants.find((v) =>
      Object.entries(nextAttrs).every(([k, val]) => v.attributes?.[k] === val)
    );
    if (match) onSelect(match);
  };

  return (
    <div className="variant-selector">
      {Object.entries(attributeGroups).map(([key, values]) => (
        <div className="variant-group" key={key}>
          <h5>{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
          <div className="variant-options">
            {values.map((value) => (
              <button
                key={value}
                className={`variant-chip ${selectedAttrs[key] === value ? "active" : ""}`}
                onClick={() => pickAttribute(key, value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}