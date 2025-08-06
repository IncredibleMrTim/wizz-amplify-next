import type { Metadata } from "next";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";

import ConfigureAmplifyClientSide from "@/components/auth/configureAmplifyClientSide/ConfigureAmplifyClientSide";
import { Container, Theme } from "@radix-ui/themes";

import outputs from "../amplify_outputs.json";
import { BreadCrumb } from "./components/breadCrumb/BreadCrumb";
import Header from "./components/header/Header";
import { AuthProvider } from "./providers/AuthProvider";
import { ReactQueryProvider } from "./providers/reactQueryProvider";
import ReduxProvider from "@/providers/reduxProvider";

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
