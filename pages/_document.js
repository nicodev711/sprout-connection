import {Html, Head, Main, NextScript} from "next/document";
import {GoogleTagManager} from "@next/third-parties/google";
import Script from "next/script";
export default function Document() {
    return <Html lang="en">
        <Head>
            <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="8baa8391-6083-493a-9e0a-66fb89829879" data-blockingmode="auto" type="text/javascript"/>
            <Script id="CookieDeclaration" src="https://consent.cookiebot.com/8baa8391-6083-493a-9e0a-66fb89829879/cd.js" type="text/javascript" async/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
    </Html>;
}
