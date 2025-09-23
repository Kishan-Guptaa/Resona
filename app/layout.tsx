import "./globals.css";
import Navbar from "./src/components/Navbar";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-r from-sky-800 via-sky-900 to-black text-white min-h-screen">
        {children}
      </body>
    </html>
  
  );
}
