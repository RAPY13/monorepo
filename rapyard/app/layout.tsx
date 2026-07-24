import type { ReactNode } from "react";
import FlowRouter from "./flow-router";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FlowRouter />
        {children}
      </body>
    </html>
  );
}