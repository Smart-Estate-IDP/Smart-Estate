import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartEstate | Real Estate & Legal Verification Platform",
  description:
    "Buy and sell properties safely with 100% legal document verification by registered legal professionals.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TabSessionProvider from "@/components/TabSessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined' && !window.__tab_fetch_interceptor_active) {
                    window.__tab_fetch_interceptor_active = true;
                    var origFetch = window.fetch;
                    window.fetch = function(input, init) {
                      try {
                        var token = sessionStorage.getItem('smartestate_token');
                        if (token) {
                          var urlStr = typeof input === 'string' ? input : (input && input.url) ? input.url : '';
                          if (urlStr.startsWith('/api/') || (window.location && urlStr.startsWith(window.location.origin + '/api/'))) {
                            init = init || {};
                            var headers = new Headers(init.headers || {});
                            if (!headers.has('Authorization')) {
                              headers.set('Authorization', 'Bearer ' + token);
                            }
                            init.headers = headers;
                          }
                        }
                      } catch(e) {}
                      return origFetch.call(this, input, init);
                    };
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#DCE5EC] text-slate-800 selection:bg-[#3155FF] selection:text-white">
        <TabSessionProvider />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
