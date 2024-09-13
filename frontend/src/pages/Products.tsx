import { LoaderFunctionArgs } from "react-router-dom";
import { Filters, PaginationContainer, ProductsContainer } from "../components";
import { customFetch } from "../utils";
import { QueryClient } from "@tanstack/react-query";
import { Pagination, SearchAndFilterParams } from "../types";

const url = "/products";

type FlexibleParams = SearchAndFilterParams &
  Pagination & {
    [k: string]: string | number | boolean;
  };

const allProductsQuery = (queryParams: FlexibleParams) => {
  const { search, category, company, order, price, shipping, page } =
    queryParams;

  return {
    queryKey: [
      "products",
      search ?? "",
      category ?? "all",
      company ?? "all",
      order ?? "a-z",
      price ?? 100000,
      shipping ?? false,
      page ?? 1,
    ],
    queryFn: () =>
      customFetch(url, {
        params: queryParams,
      }),
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    // Getting params from URL and creatng an object
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const response = await queryClient.ensureQueryData(
      allProductsQuery(params as FlexibleParams)
    );

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
