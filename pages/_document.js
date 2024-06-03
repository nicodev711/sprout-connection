import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Other head elements like meta tags can go here */}
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
