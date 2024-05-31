import { Html, Head, Main, NextScript } from "next/document";
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Document() {
  return <Html lang="en">
      <Head>

          <link rel="icon" href="/logo-noBackground - Copy.png" />
      </Head>
    <body>
      <Main />
      <NextScript />
      <GoogleAnalytics gaId="G-QCFYDDKPC2" />
    </body>
  </Html>;
}
