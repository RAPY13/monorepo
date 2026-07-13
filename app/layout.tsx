import FlowRouter from "./flow-router";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FlowRouter />
        {children}
      </body>
    </html>
  );
}
