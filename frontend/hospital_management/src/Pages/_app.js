// pages/_app.js or pages/_app.tsx
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="../public/favicon.ico" />
        {/* Add other meta tags, title, etc. here */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
