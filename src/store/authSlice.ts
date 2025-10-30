import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },

    userLoggedOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },

    loadUserFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        }
      }
      state.loading = false;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;

      if (typeof window !== "undefined" && action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
  },
});

export const { userLoggedIn, userLoggedOut, setUser, loadUserFromStorage } =
  authSlice.actions;

export default authSlice.reducer;
