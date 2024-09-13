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
import { OrderHistoryApiResponse, User } from "../types";
import { QueryClient } from "@tanstack/react-query";

type FlexibleParams = { page?: string } & {
  [k: string]: string | number;
};

export const ordersQuery = (params: FlexibleParams, user: User) => {
  return {
    queryKey: ["orders", user.name, params.page ? parseInt(params.page) : 1],
    queryFn: () =>
      customFetch.get("/orders", {
        params,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }),
  };
};

export const loader =
  (store: Store<RootState>, queryClient: QueryClient) =>
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
      const response = await queryClient.ensureQueryData(
        ordersQuery(params, user)
      );

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
