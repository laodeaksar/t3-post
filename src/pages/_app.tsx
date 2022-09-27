// src/pages/_app.tsx
import "../styles/global.css";
import "../styles/font.css";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { globalStyles, ThemeProvider, Tooltip } from "@laodeaksarr/design-system";

import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  globalStyles();

  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <Tooltip.Provider>
          <Component {...pageProps} />
        </Tooltip.Provider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
