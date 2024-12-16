import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TokenBalance from "@/components/TokenBalance";
import LiquidityBalance from "@/components/LiquidityBalance";
import { TokenBalancesType, LiquidBalancesType } from "@/lib/type";
import ActiveTransactions from "@/components/ActiveTransactions";
import NFTBalance from "@/components/NFTBalance";
interface Props {
    tokenBalances: TokenBalancesType[] | undefined;
    liquidBalances: LiquidBalancesType[] | undefined;
}

export default function AddressBalance({ tokenBalances, liquidBalances }: Props) {
    const balances = tokenBalances?.filter(tokenBalance => tokenBalance.balance?.formatted !== "0.0" && tokenBalance.info.symbol !== 'USD')
    const LPbalances = liquidBalances?.filter(liquidBalance => liquidBalance.balance?.value !== "0")
    return (
        <>
            <Tabs defaultValue="token" className="w-full my-[0.5vw] select-none">
                <TabsList className="flex flex-row justify-center bg-secondary/80">
                    <TabsTrigger value="token" className="w-[25%]">Token</TabsTrigger>
                    <TabsTrigger value="pool" className="w-[25%]">Pool</TabsTrigger>
                    <TabsTrigger value="nft" className="w-[25%]">NFT</TabsTrigger>
                    <TabsTrigger value="active" className="w-[25%]">Active</TabsTrigger>
                </TabsList>
                <TabsContent value="token" ><TokenBalance tokenBalances={balances} /></TabsContent>
                <TabsContent value="pool"><LiquidityBalance liquidityBalances={LPbalances} /></TabsContent>
                <TabsContent value="nft"><NFTBalance /></TabsContent>
                <TabsContent value="active"><ActiveTransactions /></TabsContent>
            </Tabs>
        </>
    )
}