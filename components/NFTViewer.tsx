import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react"
import { GENIUS_NFT } from "../consts/addresses";
import { Box, VStack, Text, Heading, SimpleGrid } from "@chakra-ui/react";



export default function NftViewer() {

    const address = useAddress();
    const { contract: geniusNft } = useContract(GENIUS_NFT, "nft-drop")
    const { data: ownedNfts } = useOwnedNFTs(geniusNft, address)


    return (
        <div>
            {address && Number(ownedNfts?.length) > 1 ?
                (
                    <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} p={2} spacing={2} gap={2}>
                        {ownedNfts?.map((nft, index) => (
                            <VStack key={index} textAlign={"center"} justifyContent={"center"}>
                                <ThirdwebNftMedia metadata={nft.metadata} height={"300"} width="300" />
                                <Text textAlign={"center"} textColor={"black"}>{nft.metadata.name}</Text>
                            </VStack>
                        ))}
                    </SimpleGrid>
                )
                :
                (
                    <VStack textAlign={"center"} justifyContent={"center"} m="auto">
                        <Heading textAlign={"center"} textColor={"black"}>
                            You do not own any NFT's from this collection
                        </Heading>
                    </VStack>
                )
            }

        </div>
    )
}