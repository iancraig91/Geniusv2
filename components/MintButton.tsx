import { VStack, Box, Button, Heading, Text, SimpleGrid, useDisclosure, Image, HStack, typography, useToast, Input, Divider, Spinner } from "@chakra-ui/react"
import { toWei, useAddress, useClaimedNFTSupply, useContract, useOwnedNFTs, useSDK, useUnclaimedNFTSupply } from "@thirdweb-dev/react"
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
    const [unclaimable, setUnclaimable] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const toast = useToast();

    const { contract: nftMint } = useContract("0x26ba6Bd9436cf2BE636b32cCf40b1c3843c6ac13", "nft-drop")

    const { data: data } = useUnclaimedNFTSupply(nftMint)
    const { data: data2 } = useClaimedNFTSupply(nftMint)
    const { data: ownedNfts } = useOwnedNFTs(nftMint, address)
    function showChakraToast(status: "success" | "error", description: string) {
        toast({
            title: status === 'success' ? 'Success' : 'Error',
            description,
            status,
            duration: 3000, // Duration the toast is displayed in milliseconds
            isClosable: true,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (address) {
                setLoadingData(true)
                setUserPrice(69)
                setFreeClaims(0)
                try {
                    const contract = await sdk?.getContract("0x26ba6Bd9436cf2BE636b32cCf40b1c3843c6ac13", "nft-drop");
                    const claimerProofs = await contract?.erc721.claimConditions.getClaimerProofs(
                        address
                    );
                    if (claimerProofs && claimerProofs === undefined) {
                        setUserPrice(69)
                        setUnclaimable(false)
                        setClaimerInfo(claimerProofs);
                        setLoadingData(false)

                    } else if (claimerProofs && claimerProofs?.price) {
                        setUserPrice(Number(claimerProofs?.price))
                        setFreeClaims(Number(claimerProofs?.maxClaimable))
                        setUnclaimable(false)
                        setClaimerInfo(claimerProofs);
                        setLoadingData(false)

                    } else if (claimerProofs && claimerProofs?.maxClaimable) {
                        setUserPrice(Number(claimerProofs?.price))
                        setFreeClaims(Number(claimerProofs?.maxClaimable))
                        setUnclaimable(false)
                        setClaimerInfo(claimerProofs);
                        setLoadingData(false)

                    } else if (claimerProofs && claimerProofs === null) {
                        setClaimerInfo(claimerProofs);
                        setLoadingData(false)

                    } else if (claimerProofs && claimerProofs === null) {
                        setUserPrice(69)
                        setUnclaimable(false)
                        setClaimerInfo(claimerProofs);
                        setLoadingData(false)
                    }
                    console.log(claimerProofs)
                    setLoadingData(false)
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoadingData(false)

                }
                setLoadingData(false)
            }
        };
        fetchData();
    }, [address, data2]);


    async function mint() {
        if (address) {
            setMinting(true)
            try {
                const contract = await sdk?.getContract("0x26ba6Bd9436cf2BE636b32cCf40b1c3843c6ac13", "nft-drop")
                const txResult = await contract?.erc721.claim(freeClaims >= 1 ? freeClaims : amount);
                showChakraToast("success", "You have succesfully minted your NFT")
                setMinting(false)
            } catch (error) {
                console.error(error)
                showChakraToast("error", "You faced an error whilst minting, Please see the console for more details")
                setMinting(false)
            }
        }
    }

    async function mintFriend() {
        if (address && friend) {
            setMintingFriend(true)
            try {
                const contract = await sdk?.getContract("0x26ba6Bd9436cf2BE636b32cCf40b1c3843c6ac13", "nft-drop")
                const txResult = await contract?.erc721.claimTo(
                    friend,
                    amount,
                );
                showChakraToast("success", "You have succesfully minted your friend an NFT")
                setMintingFriend(false)
            } catch (error) {
                console.error(error)
                showChakraToast("error", "You faced an error whilst minting, Please see the console for more details")
                setMintingFriend(false)
            }
        }
    }

    async function mintMax() {
        if (address) {
            setMintingMax(true)
            try {
                const contract = await sdk?.getContract("0x26ba6Bd9436cf2BE636b32cCf40b1c3843c6ac13", "nft-drop")
                const txResult = await contract?.erc721.claim(maxAmount);
                showChakraToast("success", "You have succesfully Minted your NFTs")
                setMintingMax(false)
            } catch (error) {
                console.error(error)
                showChakraToast("error", "You faced an error whilst minting, Please see the console for more details")
                setMintingMax(false)
            }
        }
    }

    return (
        <VStack maxW={"100%"} textColor={"black"}>
            {loadingData ?
                <Spinner />
                :
                <VStack textColor={"black"}>
                    <Heading textColor={"black"} >{data && data2 ? `${(Number(data2) - 1)?.toString()}/6969` : <Spinner />}</Heading>
                    {userPrice === 0 ?
                        (ownedNfts && Number(ownedNfts?.length) >= freeClaims ?

                            <VStack textColor={"black"}>
                                <Text>You have already claimed {freeClaims} For Free!</Text>
                            </VStack>
                            :
                            <VStack textColor={"black"}>
                                <Text>Mint {freeClaims} For Free!</Text>
                                <Button size={"lg"} bgGradient="linear(to-l, white, #fbdb4c)" textAlign={"center"} border={"2px"} borderColor={"black"} p={4} borderRadius={"xl"} onClick={mint} isLoading={minting}>{minting ? "Minting now" : `Mint ${freeClaims} NFT${freeClaims > 1 ? "'s" : ""} now!`}</Button>
                            </VStack>
                        )
                        :

                        (unclaimable === true ?
                            <VStack textColor={"black"}>
                                <Text>You are not able to mint right now, please try again later!</Text>
                            </VStack>
                            :
                            <VStack textColor={"black"}>

                                <Text>Total: {userPrice * amount} CRO</Text>
                                <Input bg="linear(to-r, white, #fbdb4c)" color="black" borderColor={"black"} border="1px" value={friend} textColor={"black"} placeholder="Enter an address to mint to!" onChange={(e) => setFriend(e.target.value)} />
                                <Button w="60%" fontSize={"10px"} textColor={"black"} size={"md"} bgGradient="linear(to-l, white, #fbdb4c)" textAlign={"center"} border={"2px"} borderColor={"black"} p={4} borderRadius={"xl"} onClick={mintFriend} isLoading={mintingFriend}>{mintingFriend ? "Minting now" : `Mint ${amount} NFT${amount > 1 ? "'s" : ""} to a friend now!`}</Button>
                                <Divider />
                                <Button size={"lg"}
                                    textColor={"black"}
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

                                    <Button size={"lg"} textColor={"black"} bgGradient="linear(to-l, white, #fbdb4c)" textAlign={"center"} border={"2px"} borderColor={"black"} p={4} borderRadius={"xl"} onClick={mint} isLoading={minting}>{minting ? "Minting now" : `Mint ${amount} NFT${amount > 1 ? "'s" : ""} now!`}</Button>

                                    <Button
                                        size={"lg"}
                                        textColor={"black"}
                                        bg="transparent"
                                        rightIcon={<FaArrowRight color="black" />}
                                        border={"2px"} borderColor={"black"}
                                        onClick={() => setAmount(amount + 1)} />
                                </HStack>
                            </VStack>

                        )
                    }
                </VStack>
            }

        </VStack>
    )
}
