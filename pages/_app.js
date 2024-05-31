import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import {UserProvider} from "@/contexts/UserContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "@/components/Footer";
import Head from 'next/head'
import {GoogleAnalytics} from '@next/third-parties/google'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
        <Head>
            <GoogleAnalytics gaId="G-QCFYDDKPC2" />
            <title>Sprout Connection</title>
        </Head>
        <UserProvider>
            <Navbar />
            <Component {...pageProps} />
            <Footer/>
        </UserProvider>
        </>
    );
}