import type { Metadata } from "next";
import '@mantine/core/styles.css';
import { AppShell, ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";


export const metadata: Metadata = {
  title: "Score Keep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript suppressHydrationWarning defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider forceColorScheme="dark">
          <AppShell header={{ height: 50 }} padding={10}>
            {children}
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
