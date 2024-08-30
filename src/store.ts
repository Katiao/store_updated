import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    cartState: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
