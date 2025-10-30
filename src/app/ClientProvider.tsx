"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Navbar />
      {children}
    </Provider>
  );
}
