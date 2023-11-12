import { ChainId, ConnectWallet, useChainId, useSwitchAccount, useSwitchChain, useAddress, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import MintInfo from "../components/MintInfo";
import MintButton from "../components/MintButton";
import { Switch, VStack, Box, Text, Heading, Button, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NftViewer from "../components/NFTViewer";
import { Cronos, Polygon } from "@thirdweb-dev/chains";

const Home: NextPage = () => {
  const [isShowing, setIsShowing] = useState(false)
  const address = useAddress();
  const chainId = useChainId();
  const switchChain = useSwitchChain();


  if (!address) {
    return (
      <VStack>
        <Image src="/images/Logo.jpeg" width={300} height={300} alt="Logo" />

        <Heading>Please Connect To Genius To Mint</Heading>
        <ConnectWallet
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
      </VStack>
    )
  }

  if (address && chainId !== Cronos.chainId) {
    return (
      <VStack mt={10}>
        <Image src="/images/Logo.jpeg" w={300} h={300} alt="Logo" />
        <Heading>Please Switch To Cronos</Heading>
        <Button onClick={() => switchChain(Cronos.chainId)}>Switch now</Button>
      </VStack>
    )
  }


  return (
    <main className={styles.main}>
      <VStack justifyContent={"center"} textAlign={"center"} m="auto">
        <MintInfo />
        <MintButton />

        <VStack mt={10} as={Switch} textColor="black" onChange={() => setIsShowing(isShowing ? !isShowing : true)}><Text mt={2}>{isShowing ? "Hide NFT's" : "View NFT's"}</Text> </VStack>
        {isShowing ?
          <VStack mt={10}>
            <NftViewer />
          </VStack> : ""
        }
      </VStack>
    </main>
  );
};

export default Home;
