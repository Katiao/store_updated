import { useSelector } from "react-redux";
import { formatPrice } from "../utils";
import { RootState } from "../store";

export const CartTotals = () => {
  const { cartTotal, shipping, tax, orderTotal } = useSelector(
    (state: RootState) => state.cartState
  );

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        {/* SUBTOTAL */}
        {/* TODO: remove repetition classes or create components */}
        <p className="flex justify-between text-xs border-b border-base-300 pb-2">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(String(cartTotal))}</span>
        </p>
        {/* SHIPPING */}
        <p className="flex justify-between text-xs border-b border-base-300 pb-2">
          <span>Shipping</span>
          <span className="font-medium">{formatPrice(String(shipping))}</span>
        </p>
        {/* Tax */}
        <p className="flex justify-between text-xs border-b border-base-300 pb-2">
          <span>Tax</span>
          <span className="font-medium">{formatPrice(String(tax))}</span>
        </p>
        {/* Total */}
        <p className="mt-4 flex justify-between text-sm  pb-2">
          <span className="font-bold">Order Total</span>
          <span className="font-bold">{formatPrice(String(orderTotal))}</span>
        </p>
      </div>
    </div>
  );
};
