import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { CartProduct } from "../../types";

type CartState = {
  cartItems: CartProduct[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
};

const defaultState: CartState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 500,
  tax: 0,
  orderTotal: 0,
};

const getCartFromLocalStorage = (): CartState => {
  const cartData = localStorage.getItem("cart");
  if (cartData === null) {
    return defaultState;
  }
  try {
    return JSON.parse(cartData) as CartState;
  } catch (error) {
    console.error("Error parsing cart data from localStorage:", error);
    return defaultState;
  }
};

type Payload = {
  product: CartProduct;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getCartFromLocalStorage(),
  reducers: {
    addItem: (state, action: PayloadAction<Payload>) => {
      const { product } = action.payload;
      const item = state.cartItems.find(
        (i) => i.productID === product.productID
      );
      if (item) {
        item.amount += product.amount;
      } else {
        state.cartItems.push(product);
      }
      state.numItemsInCart += product.amount;
      state.cartTotal += Number(product.price) * product.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success("item added to cart");
    },
    clearCart: (state) => {
      localStorage.setItem("cart", JSON.stringify(defaultState));
      return defaultState;
    },

    removeItem: (state, action) => {
      const { productID } = action.payload;
      const product = state.cartItems.find((i) => i.productID === productID);
      state.cartItems = state.cartItems.filter(
        (i) => i.productID !== productID
      );

      state.numItemsInCart -= product!.amount;
      state.cartTotal -= Number(product!.price) * product!.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.error("Item removed from cart");
    },

    editItem: (state, action) => {
      const { productID, amount } = action.payload;
      const item = state.cartItems.find((i) => i.productID === productID);
      state.numItemsInCart += amount - item!.amount;
      state.cartTotal += Number(item!.price) * (amount - item!.amount);
      item!.amount = amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success("Cart updated");
    },

    calculateTotals: (state) => {
      state.tax = 0.1 * state.cartTotal;
      state.orderTotal = state.cartTotal + state.shipping + state.tax;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addItem, removeItem, editItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
