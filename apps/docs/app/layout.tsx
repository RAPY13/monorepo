export default function RootLayout({ children }) {
  return (
    <html>
      <body className='bg-black text-white'>{children}</body>
    </html>
  );
}
