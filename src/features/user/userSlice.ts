import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import type { Theme } from "../../types";

const getThemeFromLocalStorage = (): Theme => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "lemonade" || storedTheme === "dim") {
    // Need to add theme to index.html to make it work
    document.documentElement.setAttribute("data-theme", storedTheme);
    return storedTheme;
  }
  document.documentElement.setAttribute("data-theme", "lemonade");
  return "lemonade";
};

type UserState = {
  user?: { username: string };
  theme: Theme;
};

const initialState: UserState = {
  user: { username: "coding addict" },
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log("login");
    },
    logoutUser: (state) => {
      state.user = undefined;
      // localStorage.clear()
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dim" ? "lemonade" : "dim";
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { loginUser, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
