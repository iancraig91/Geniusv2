import type { AppProps } from "next/app";
import { ConnectWallet, NATIVE_TOKEN_ADDRESS, ThirdwebProvider } from "@thirdweb-dev/react";
import { Cronos, Polygon } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import { Center, ChakraProvider, VStack, Button } from "@chakra-ui/react";

const activeChain = "ethereum";

function MyApp({ Component, pageProps }: AppProps) {



  return (
    <ThirdwebProvider
      clientId={process.env.TW_CLIENT_ID!}
      activeChain={Cronos}
      dAppMeta={{
        name: "Genius Mint Dapp",
        description: "Make a wish, maybe the genies will grant it",
        logoUrl: "/images/Logo.Jpeg",
        url: "https://www.genius.app",
        isDarkMode: true,
      }}
      autoSwitch={true}
    >
      <ChakraProvider>
        <VStack bg="#fbdb4c" minH="100vh" textAlign={"center"} justifyContent={"center"}>
          <Button
            mt={{ base: 10 }}
            as={ConnectWallet}
            btnTitle="Connect To Genius"
            modalTitle="Select A Wallet To Continue"
            welcomeScreen={{
              title: "Genius Mint Dapp",
              subtitle: "Make a wish, maybe the genies will grant it",
              img: {
                src: "/images/Logo.Jpeg",
                width: 400,
                height: 400,
              },
            }}
            theme={"light"}
            dropdownPosition={{
              side: "bottom", //  "top" | "bottom" | "left" | "right";
              align: "center", // "start" | "center" | "end";
            }} modalTitleIconUrl=""
            displayBalanceToken={{
              [Cronos.chainId]: "0x990681fa558932F715420d8812397799b90Ab6BE", // contract address of Dai Stablecoin token
            }}
            supportedTokens={{
              [Cronos.chainId]: [
                {
                  address: "0x990681fa558932F715420d8812397799b90Ab6BE",
                  name: "Genius Token",
                  symbol: "GENIUS",
                  icon: "/tokens/REYELogo.png",
                },
                {
                  address: "0x4137A9F6eb939a8d7d620b239B562596E48d6F41",
                  name: "Steak Token",
                  symbol: "STEAK",
                  icon: "/tokens/SteakLogo.png",
                },
                {
                  address: "0xCda4007dc297f59eeC9251723d81CBfd499341D7",
                  name: "NCTR Cro",
                  symbol: "NCTR",
                  icon: "/tokens/NCTRLogo.png",
                },
                {
                  address: "0x513b35dFEb34a3cDb673d9b9421532F545d86bb1",
                  name: "Roast Token",
                  symbol: "ROAST",
                  icon: "/tokens/RoastLogo.png",
                },
                {
                  address: "0xC12c4892C29F815157F399D3662FE94f0B23cd34",
                  name: "Ribeye Token",
                  symbol: "REYE",
                  icon: "/tokens/REYELogo.png",
                },
              ],

              [Polygon.chainId]: [
                {
                  address: NATIVE_TOKEN_ADDRESS,
                  name: "Cronos",
                  symbol: "CRO",
                  icon: "/tokens/CRO.png",
                },
              ],
            }}
          />
          <Component {...pageProps} />
        </VStack>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
