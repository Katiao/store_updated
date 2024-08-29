import { LoaderFunctionArgs } from "react-router-dom";
import { Filters, PaginationContainer, ProductsContainer } from "../components";
import { customFetch } from "../utils";

const url = "/products";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Getting params from URL and creatng an object
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  const response = await customFetch(url, { params });

  const products = response.data.data;
  const meta = response.data.meta;
  // need to pass down params so that the filters default values are in sync with the URL
  return { products, meta, params };
};

export const Products = () => {
  return (
    <>
      <Filters />
      <ProductsContainer />
      <PaginationContainer />
    </>
  );
};
