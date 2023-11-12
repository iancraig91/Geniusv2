import { VStack, Box, Button, Heading, Text, SimpleGrid, useDisclosure, Image, HStack, typography, useToast, Input, Divider, Spinner } from "@chakra-ui/react"
import { toWei, useAddress, useClaimedNFTSupply, useContract, useSDK, useUnclaimedNFTSupply } from "@thirdweb-dev/react"
import Head from "next/head"
import { useEffect, useState } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"


type NftInfo = {
    price?: string | undefined;
    currencyAddress?: string | undefined;
    address: string;
    proof: string[];
    maxClaimable: string;
} | null | undefined;



export default function MintButton() {
    const address = useAddress()
    const sdk = useSDK()
    const [amount, setAmount] = useState(1);
    const [friend, setFriend] = useState("")
    const maxAmount = 100
    const maxPrice = 100 * 69
    const maxPriceWl = 100 * 42

    const priceWl = 42
    const pricePublic = 69

    const [minting, setMinting] = useState(false)
    const [mintingFriend, setMintingFriend] = useState(false)
    const [mintingMax, setMintingMax] = useState(false)
    const [claimerInfo, setClaimerInfo] = useState<NftInfo>()
    const [userPrice, setUserPrice] = useState(69)
    const [freeClaims, setFreeClaims] = useState(0)
    const toast = useToast();

    const { contract: nftMint } = useContract("0x5DAf5C61cb6FC86aBBaf3129040e74f8011fbb2D", "nft-drop")

    const { data: data } = useUnclaimedNFTSupply(nftMint)
    const { data: data2 } = useClaimedNFTSupply(nftMint)

    useEffect(() => {
        const fetchData = async () => {
            if (address) {
                try {
                    const contract = await sdk?.getContract("0x5DAf5C61cb6FC86aBBaf3129040e74f8011fbb2D", "nft-drop");
                    const claimerProofs = await contract?.erc721.claimConditions.getClaimerProofs(
                        address
                    );
                    console.log(claimerProofs)
                    setClaimerInfo(claimerProofs);
                    if (claimerProofs === null) {
                        setUserPrice(69)
                    } else if (claimerProofs && claimerProofs?.price) {
                        setUserPrice(Number(claimerProofs?.price))
                        setFreeClaims(Number(claimerProofs?.maxClaimable))
                    } else if (claimerProofs && claimerProofs?.maxClaimable) {
                        setUserPrice(Number(0))
                        setFreeClaims(Number(claimerProofs?.maxClaimable))
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, []);


    async function mint() {
        if (address) {
            setMinting(true)
            try {
                const contract = await sdk?.getContract("0x5DAf5C61cb6FC86aBBaf3129040e74f8011fbb2D", "nft-drop")
                    const txResult = await contract?.erc721.claim(freeClaims >= 1 ? freeClaims : amount );
                
                setMinting(false)
            } catch (error) {
                console.error(error)
                setMinting(false)
            }
        }
    }

    async function mintFriend() {
        if (address && friend) {
            setMintingFriend(true)
            try {
                const contract = await sdk?.getContract("0x5DAf5C61cb6FC86aBBaf3129040e74f8011fbb2D", "nft-drop")
                const txResult = await contract?.erc721.claimTo(
                    friend,
                    amount,
                );
                setMintingFriend(false)
            } catch (error) {
                console.error(error)
                setMintingFriend(false)
            }
        }
    }

    async function mintMax() {
        if (address) {
            setMintingMax(true)
            try {
                const contract = await sdk?.getContract("0x5DAf5C61cb6FC86aBBaf3129040e74f8011fbb2D", "nft-drop")
                const txResult = await contract?.erc721.claim(maxAmount);
                setMintingMax(false)
            } catch (error) {
                console.error(error)
                setMintingMax(false)
            }
        }
    }

    return (
        <VStack maxW={"100%"}>
            <Heading textColor={"black"} >{data && data2 ? `${(Number(data2))?.toString()}/6969` : <Spinner />}</Heading>
            {userPrice === 0 ?
                <VStack>
                    <Text>Mint {freeClaims} For Free!</Text>
                    <Button size={"lg"} bgGradient="linear(to-l, white, #fbdb4c)" textAlign={"center"} border={"2px"} borderColor={"black"} p={4} borderRadius={"xl"} onClick={mint} isLoading={minting}>{minting ? "Minting now" : `Mint ${freeClaims} NFT${freeClaims > 1 ? "'s" : ""} now!`}</Button>
                </VStack>

                :

                <VStack>

                <Text>Total: {userPrice * amount} CRO</Text>
                <Input bg="white" value={friend} placeholder="Enter an address to mint to!" onChange={(e) => setFriend(e.target.value)} />
                <Button w="60%" fontSize={"10px"} size={"md"} bgGradient="linear(to-l, white, #fbdb4c)" textAlign={"center"} border={"2px"} borderColor={"black"} p={4} borderRadius={"xl"} onClick={mintFriend} isLoading={mintingFriend}>{mintingFriend ? "Minting now" : `Mint ${amount} NFT${amount > 1 ? "'s" : ""} to a friend now!`}</Button>
                <Divider />
                <Button size={"lg"}
                    bgGradient="linear(to-r, white, #fbdb4c)"
                    textAlign={"center"}
                    border={"2px"}
                    borderColor={"black"}
                    p={4}
                    borderRadius={"xl"}
                    onClick={mintMax}
                    isLoading={mintingMax}>{mintingMax ? "Minting now" : `MAX MINT`}</Button>
                <Divider />
    
                <HStack m="auto" textAlign={"center"} justifyContent={"center"} >
                    <Button
                        size={"lg"}
                        bg="transparent"
                        leftIcon={<FaArrowLeft color="black" />}
                        border={"2px"}
                        borderColor={"black"}
                        onClick={() => setAmount(amount >= 2 ? amount - 1 : 1)} />
    
                    <Button size={"lg"} bgGradient="linear(to-l, white, #fbdb4c)" textAlign={"center"} border={"2px"} borderColor={"black"} p={4} borderRadius={"xl"} onClick={mint} isLoading={minting}>{minting ? "Minting now" : `Mint ${amount} NFT${amount > 1 ? "'s" : ""} now!`}</Button>
    
                    <Button
                        size={"lg"}
                        bg="transparent"
                        rightIcon={<FaArrowRight color="black" />}
                        border={"2px"} borderColor={"black"}
                        onClick={() => setAmount(amount + 1)} />
                </HStack>
                </VStack>
            }
        </VStack>
    )
}
