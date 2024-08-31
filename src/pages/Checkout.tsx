import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckoutForm, SectionTitle, CartTotals } from "../components";
import { RootState } from "../store";
import { Store } from "@reduxjs/toolkit";

export const loader = (store: Store<RootState>) => async () => {
  const user = store.getState().userState.user;

  if (!user) {
    toast.warn("You must be logged in to checkout");
    return redirect("/login");
  }
  return null;
};

export const Checkout = () => {
  const cartItems = useSelector(
    (state: RootState) => state.cartState.cartTotal
  );
  if (cartItems === 0) {
    return <SectionTitle text="Your cart is empty" />;
  }
  return (
    <>
      <SectionTitle text="Place your order" />
      <div className="mt-8 grid gap-8  md:grid-cols-2 items-start">
        <CheckoutForm />
        <CartTotals />
      </div>
    </>
  );
};
