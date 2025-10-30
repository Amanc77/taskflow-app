"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import { loadUserFromStorage } from "@/store/authSlice";

function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return null;
}

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <InitAuth />
      <Navbar />
      <main>{children}</main>
    </Provider>
  );
}
