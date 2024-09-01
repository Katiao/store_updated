import { FeaturedProducts, Hero } from "../components";
import { customFetch } from "../utils";

import { QueryClient } from "@tanstack/react-query";

const url = "/products?featured=true";

const featuredProductsQuery = {
  queryKey: ["featuredProducts"],
  queryFn: () => customFetch(url),
};

export const loader = (queryClient: QueryClient) => async () => {
  const response = await queryClient.ensureQueryData(featuredProductsQuery);
  const products = response.data.data;
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
