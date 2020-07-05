import { AppProps } from "next/app";
import "@montezume/react-progressive-image/dist/index.css";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
