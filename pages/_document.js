import {Html, Head, Main, NextScript} from "next/document";
import Script from "next/script";

export default function Document() {
    return <Html lang="en">
        <Head>
            <Script src={"https://www.googletagmanager.com/gtag/js?id=G-QCFYDDKPC2"}/>
            <Script id={"analytics"}>
                {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-QCFYDDKPC2');`}
            </Script>
            <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="8baa8391-6083-493a-9e0a-66fb89829879" data-blockingmode="auto" type="text/javascript"/>

        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
    </Html>;
}
