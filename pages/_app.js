import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "@/components/Footer";
import Head from 'next/head';
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/logo-noBackground - Copy.png"/>
                <title>Sprout Connection</title>
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
