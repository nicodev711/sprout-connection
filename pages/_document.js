import {Html, Head, Main, NextScript} from "next/document";
import { GoogleTagManager } from '@next/third-parties/google'
export default function Document() {
    return <Html lang="en">
        <Head/>
        <body>
        <Main/>
        <NextScript/>
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M725PM8F"
                    height="0" width="0" style={{display:"none", visibility:"hidden"}}></iframe>
        </noscript>
        </body>
        <GoogleTagManager gtmId="GTM-M725PM8F"/>
    </Html>;
}
