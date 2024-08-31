import { ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import {
  OrdersList,
  ComplexPaginationContainer,
  SectionTitle,
} from "../components";
import { RootState } from "../store";
import { Store } from "@reduxjs/toolkit";
import { OrderHistoryApiResponse } from "../types";

export const loader =
  (store: Store<RootState>) =>
  async ({ request }: ActionFunctionArgs) => {
    const user = store.getState().userState.user;

    if (!user) {
      toast.warn("You must be logged in to view orders");
      return redirect("/login");
    }

    // This is needed for pagination
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    try {
      const response = await customFetch.get<OrderHistoryApiResponse>(
        "/orders",
        {
          params,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("response.data", response.data);

      return { orders: response.data.data, meta: response.data.meta };
    } catch (error) {
      console.log(error);
      const errorMessage =
        // TODO: handle error type
        // @ts-ignore
        error?.response?.data?.error?.message ||
        "there was an error accessing your orders";

      toast.error(errorMessage);
      // in case JWT token is invalid or missing
      // TODO: handle error type
      // @ts-ignore
      if (error?.response?.status === 401 || 403) return redirect("/login");

      return null;
    }
  };

export const Orders = () => {
  const { meta } = useLoaderData() as OrderHistoryApiResponse;

  if (meta.pagination.total < 1) {
    return <SectionTitle text="Please make an order" />;
  }

  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrdersList />
      <ComplexPaginationContainer />
    </>
  );
};
