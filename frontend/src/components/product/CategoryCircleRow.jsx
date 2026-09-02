import { Link } from "react-router-dom";

const CATEGORIES = [
  { name: "Earrings", slug: "earrings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Rings", slug: "rings" },
  { name: "Bangles", slug: "bangles" },
  { name: "Mangalsutra", slug: "mangalsutra" },
  { name: "Anklets", slug: "anklets" },
];

export default function CategoryCircleRow() {
  return (
    <div className="circle-row">
      {CATEGORIES.map((cat) => (
        <Link to={`/shop?category=${cat.slug}`} key={cat.slug} className="circle-item">
          <div className="circle-img"></div>
          <h4>{cat.name}</h4>
        </Link>
      ))}
    </div>
  );
}