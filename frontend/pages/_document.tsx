import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
  
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });
  
    const initialProps = await Document.getInitialProps(ctx);
  
    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon/D-favicon-32.png" sizes="32x32" />
          <link rel="icon" href="/favicon/D-favicon-57.png" sizes="57x57" />
          <link rel="icon" href="/favicon/D-favicon-76.png" sizes="76x76" />
          <link rel="icon" href="/favicon/D-favicon-96.png" sizes="96x96" />
          <link rel="icon" href="/favicon/D-favicon-128.png" sizes="128x128" />
          <link rel="icon" href="/favicon/D-favicon-192.png" sizes="192x192" />
          <link rel="shortcut icon" sizes="196x196" href="/favicon/D-favicon-196.png" />
          <link rel="apple-touch-icon" href="/favicon/D-favicon-120.png" sizes="120x120" />
          <link rel="apple-touch-icon" href="/favicon/D-favicon-152.png" sizes="152x152" />
          <link rel="apple-touch-icon" href="/favicon/D-favicon-180.png" sizes="180x180" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
