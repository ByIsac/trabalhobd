import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Adicione o caminho correto para seu CSS global, se houver

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;