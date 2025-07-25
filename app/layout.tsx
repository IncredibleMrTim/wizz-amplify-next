import type { Metadata } from "next";

import { Container, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";

import "@aws-amplify/ui-react/styles.css";
import ConfigureAmplifyClientSide from "@/components/auth/configureAmplifyClientSide/ConfigureAmplifyClientSide";
import Header from "./components/header/Header";
import ReduxProvider from "./providers/reduxProvider";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { ReactQueryProvider } from "./providers/reactQueryProvider";
import { BreadCrumb } from "./components/breadCrumb/BreadCrumb";
import { AuthProvider } from "./providers/AuthProvider";
Amplify.configure(outputs);

export const metadata: Metadata = {
  title: "Wizzington Moo's UK",
  description:
    "Welcome to Wizzington Moo's UK, your one-stop shop for all things moo-tastic!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigureAmplifyClientSide />
        <Theme>
          <ReactQueryProvider>
            <ReduxProvider>
              <AuthProvider>
                <Header />

                <Container
                  size="4"
                  className="!m-0 !p-0 bg-gradient-to-br from-purple-50  to-white min-h-screen"
                >
                  <BreadCrumb />
                  {children}
                </Container>
              </AuthProvider>
            </ReduxProvider>
          </ReactQueryProvider>
        </Theme>
      </body>
    </html>
  );
}
