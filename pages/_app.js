import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "@/components/Footer";
import Head from 'next/head';
import Script from "next/script";
import keywords from '@/utils/keywords';


export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/logo-noBackground - Copy.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="language" content="en" />
                {/* General Open Graph Meta Tags */}
                <meta property="og:site_name" content="Sprout Connections" />
                <meta property="og:type" content="website" />
                {/* Canonical Tag */}
                <link rel="canonical" href="https://www.sproutconnections.com" />
                {/* JSON-LD Structured Data */}
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "Sprout Connections",
                      "url": "https://www.sproutconnections.com",
                      "logo": "https://www.sproutconnections.com/logo-noBackground - Copy.png"
                    }
                    `}
                </script>
            </Head>
            <UserProvider>
                <Navbar />
                <Component {...pageProps} />
                <Footer />
            </UserProvider>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QCFYDDKPC2" />
            <Script id="googleAnalytics">
                {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-QCFYDDKPC2');`}
            </Script>
            <Script
                id="Cookiebot"
                src="https://consent.cookiebot.com/uc.js"
                data-cbid="8baa8391-6083-493a-9e0a-66fb89829879"
                data-blockingmode="auto"
                type="text/javascript"
                strategy="afterInteractive"
            />
        </>
    );
}
