import {Html, Head, Main, NextScript} from "next/document";
import {GoogleTagManager} from "@next/third-parties/google";
import Script from "next/script";
export default function Document() {
    return <Html lang="en">
        <Head>
            <GoogleTagManager gtmId={"GTM-M725PM8F"}/>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QCFYDDKPC2"/>
            <Script id={"googleAnalytics"}>
                {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-QCFYDDKPC2');`}
            </Script>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
    </Html>;
}
