import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import type { Theme, User } from "../../types";

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

const getUserFromLocalStorage = (): User | undefined => {
  const userString = localStorage.getItem("user");
  if (userString === null) {
    return undefined;
  }
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return undefined;
  }
};

type UserState = {
  user?: User;
  theme: Theme;
};

const initialState: UserState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = { ...action.payload.user, token: action.payload.token };
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
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
