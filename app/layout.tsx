"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "../store/store";
import "./globals.css"; // ✅ Ensure this file exists

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
