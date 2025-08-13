import "@/styles/globals.css";
import "@/styles/tutors.css";
import "@/styles/navbar.css";
import "@/styles/footer.css";
import "@/styles/index.css";
import "@/styles/profile.css";
import "@/styles/lecturersDraft.css";


import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
