import { Form, redirect, ActionFunctionArgs } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../store";
import { Store } from "@reduxjs/toolkit";
import { customFetch, formatPrice } from "../utils";
import { clearCart } from "../features/cart/cartSlice";
import { FormInput } from "./FormInput";
import { SubmitBtn } from "./SubmitBtn";
import { QueryClient } from "@tanstack/react-query";

export const action =
  (store: Store<RootState>, queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const { name, address } = Object.fromEntries(formData);
    const user = store.getState().userState.user;
    const { cartItems, orderTotal, numItemsInCart } =
      store.getState().cartState;

    const info = {
      name,
      address,
      chargeTotal: orderTotal,
      orderTotal: formatPrice(String(orderTotal)),
      cartItems,
      numItemsInCart,
    };

    try {
      await customFetch.post(
        "/orders",
        { data: info },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      queryClient.removeQueries(["orders"]);
      store.dispatch(clearCart());
      toast.success("order placed successfully");
      return redirect("/orders");
    } catch (error) {
      console.log(error);
      const errorMessage =
        // TODO: handle error type
        // @ts-ignore
        error?.response?.data?.error?.message ||
        "there was an error placing your order";
      toast.error(errorMessage);
      // in case JWT token is invalid or missing
      // TODO: handle error type
      // @ts-ignore
      if (error?.response?.status === 401 || 403) return redirect("/login");

      return null;
    }
  };

export const CheckoutForm = () => {
  return (
    <Form method="POST" className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl">Shipping Information</h4>
      <FormInput label="first name" name="name" type="text" />
      <FormInput label="address" name="address" type="text" />
      <div className="mt-4">
        <SubmitBtn text="Place Your Order" />
      </div>
    </Form>
  );
};
