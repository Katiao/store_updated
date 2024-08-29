import { FeaturedProducts, Hero } from "../components";
import { customFetch } from "../utils";

import type { Products } from "../types";

const url = "/products?featured=true";

export const loader = async () => {
  const response = await customFetch(url);
  const products: Products = response.data.data;
  return { products };
};

export const Landing = () => {
  return (
    <>
      <Hero />

      <FeaturedProducts />
    </>
  );
};
