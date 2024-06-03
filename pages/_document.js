import {Html, Head, Main, NextScript} from "next/document";
import {GoogleTagManager} from "@next/third-parties/google";
export default function Document() {
    return <Html lang="en">
        <Head>
            <GoogleTagManager gtmId={"GTM-M725PM8F"}/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
    </Html>;
}
