// app/providers.tsx
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { memo, useState } from "react";
import { Context } from "./Context";
const Providers = ({ children, session }) => {
  const [modalData, setModalData] = useState({});
  const [collops, setCollops] = useState(true);
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SessionProvider session={session}>
          <Toaster position="top-right" richColors closeButton />
          <Context.Provider
            value={{
              modalData,
              setModalData,
              collops,
              setCollops,
            }}
          >
            {children}
          </Context.Provider>
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default memo(Providers);
