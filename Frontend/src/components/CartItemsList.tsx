import { useSelector } from "react-redux";
import { CartItem } from "./CartItem";
import { RootState } from "../store";

export const CartItemsList = () => {
  const cartItems = useSelector(
    (state: RootState) => state.cartState.cartItems
  );

  return (
    <div>
      {cartItems.map((item) => {
        return <CartItem key={item.cartID} cartItem={item} />;
      })}
    </div>
  );
};
