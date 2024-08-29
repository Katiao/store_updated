import { Link } from "react-router-dom";

// possibly make a more generic component for breadcrumbs

export const Breadcrumbs = () => {
  return (
    <div className="text-md breadcrumbs">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
      </ul>
    </div>
  );
};
