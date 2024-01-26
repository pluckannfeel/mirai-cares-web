// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import React from "react";
import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Loader from "./core/components/Loader";

// import usePageTracking from "./core/hooks/usePageTracking";
import SettingsProvider from "./core/contexts/SettingsProvider";
import QueryWrapper from "./core/components/QueryWrapper";
import SnackbarProvider from "./core/contexts/SnackbarProvider";
import AuthProvider from "./auth/contexts/AuthProvider";
import AppRoutes from "./AppRoutes";
import { I18nextProvider } from "react-i18next";
import i18n from "./core/config/i18n";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      suspense: true,
    },
  },
});

function App() {
  // console.log(import.meta.env.BASE_URL);
  // usePageTracking();

  return (
    <React.Suspense fallback={<Loader />}>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
          <div>
            <h1>Something went wrong</h1>
            <p>{error.toString()}</p>
            <p>{componentStack}</p>
            <button onClick={resetError}>Try again</button>
          </div>
        )}
      >
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <SettingsProvider>
              <QueryWrapper>
                <SnackbarProvider>
                  <AuthProvider>
                    <AppRoutes />
                  </AuthProvider>
                </SnackbarProvider>
              </QueryWrapper>
            </SettingsProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </Sentry.ErrorBoundary>
    </React.Suspense>
  );
}

export default App;
