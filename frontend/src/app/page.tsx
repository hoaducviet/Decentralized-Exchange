'use client'
import { useState } from "react"
import { useAccount } from "wagmi"
import Link from "next/link"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import OptionsWallet from "@/components/wallet/OptionsWallet"

const mainTitle1 = "Fast for everyone."
const mainTitle2 = " Trade Easy, Trade Everywhere."
const mainDetail = "Secure, fast, and accessible decentralized trading for tokens and NFTs."
const useTitle = "One Exchange, Unlimited Potential"
const cardTitle1 = "The largest and"
const cardTitle2 = "most thriving ecosystem"
const faqs = [
  {
    title: "What is Exchange?",
    content: `Exchange is a secure and user-friendly trading platform designed for seamless transactions in various markets, including cryptocurrencies, nfts. With advanced technology and a focus on user experience, Exchange ensures fast, reliable, and transparent operations for traders of all levels.`
  },
  {
    title: "How do I use?",
    content: "Connect Your Wallet: As a decentralized exchange (DEX), Exchange requires you to connect a compatible digital wallet like MetaMask, Trust Wallet, or WalletConnect. Fund Your Wallet: Deposit tokens into your wallet or use our integrated on- ramp services to purchase cryptocurrency directly. Start Trading: Browse available tokens and NFTs, and use our intuitive interface to buy, sell, or swap assets seamlessly. Stay in Control: Since Exchange is decentralized, you retain full ownership of your assets at all times. With wallet integration and easy funding options, Exchange makes trading tokens and NFTs secure and user friendly."
  },
  {
    title: "Is Exchange a safe cryptocurrency exchange?",
    content: "Exchange is committed to providing a safe and reliable trading platform, and boasts one of the most sophisticated security technologies and maintenance teams in the world, including a dedicated security team constantly working to keep your assets and accounts safe, along with independently verified Proof of Reserves to authenticate all user assets on a 1:1 basis."
  },
  {
    title: "What can I trade here?",
    content: "Tokens: Trade a wide range of tokens from popular cryptocurrencies to emerging tokens across different blockchains. NFTs: Buy, sell, and trade unique digital collectibles, from art to gaming assets, in our NFT marketplace. Cross-chain Assets: With our multi-chain support, you can trade assets across various blockchains without any hassle. With an extensive selection of tokens and NFTs, Exchange provides a diverse and dynamic trading experience."
  },
  {
    title: "Where does this platform provide services?",
    content: "Exchange provides services globally, available to users from any location. As a decentralized platform, it operates without geographical restrictions, enabling anyone with an internet connection to access and trade assets. Whether you're in North America, Europe, Asia, or beyond, Exchange ensures secure and seamless trading experiences for users worldwide."
  },
  {
    title: "What methods can I use to deposit and withdraw funds?",
    content: "On Exchange, you can deposit and withdraw funds using the following methods: USD via PayPal: Easily deposit and withdraw funds in USD using your PayPal account. Transfers to Other Accounts: You can also transfer funds directly to other accounts as needed. These methods provide convenient, secure, and fast options for managing your assets."
  },
]
const faqsTitle = "FAQs"

export default function Home() {
  const [isBuy, setIsBuy] = useState<boolean>(true)
  const { isConnected } = useAccount()
  const handleToken = () => {
    setIsBuy(true)
  }
  const handleNft = () => {
    setIsBuy(false)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative select-none bg-black flex flex-row w-full py-[2vw] h-[45vw] space-x-[3vw]">
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white space-y-6">
          <div className="flex flex-col justify-center items-center text-6xl font-semibold space-y-4 bg-gradient-to-br from-white via-blue-500 to-purple-500 bg-clip-text text-transparent">
            <p>{mainTitle1}</p>
            <p>{mainTitle2}</p>
          </div>
          <p className="flex flex-col justify-center items-center text-xl pb-[7vw] bg-gradient-to-br from-white to-purple-500  bg-clip-text text-transparent">{mainDetail}</p>
          {isConnected ?
            <Link href="/trade">
              <div className="cursor-pointer hover:opacity-100 opacity-80 bg-transparent flex flex-row border-[1px] dark:border-white  rounded-full justify-center items-center text-lg font-semibold py-[1vw] px-[1.5vw]">
                <p className="bg-gradient-to-tr from-white to-blue-500  bg-clip-text text-transparent">Start Exchange</p>
              </div>
            </Link> :
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer hover:opacity-100 opacity-80 bg-transparent flex flex-row border-[1px] dark:border-white  rounded-full justify-center items-center text-lg font-semibold py-[1vw] px-[1.5vw]">
                  <p className="bg-gradient-to-tr from-white to-blue-500  bg-clip-text text-transparent">Start Connect Wallet</p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="bg-black rounded-2xl border-none text-white">
                <OptionsWallet />
              </PopoverContent>
            </Popover>
          }
        </div>
        <div className="flex flex-col justify-center items-center w-[50%] h-[40vw]">
          <video
            src="https://polytech-assets.polygon.technology/videos/solutions/pos.mp4"
            autoPlay
            loop
            muted
            width="100%"
            height="auto"
            className="w-[80%] h-[35vw] object-cover"
          />
        </div>
        <div className="flex flex-col justify-center items-center w-[50%] h-[40vw]">
          <video
            src="https://polytech-assets.polygon.technology/videos/solutions/zkevm720p.mp4"
            autoPlay
            loop
            muted
            width="100%"
            height="auto"
            className="w-[80%] h-[35vw] object-cover"
          />
        </div>
      </div>
      <div className="select-none flex flex-row px-[20vw] py-[4vw] border-t-[0.5px] border-white/20 space-x-[3vw]">
        <div className="flex flex-col justify-center items-center w-[40%] ">
          {isBuy ? <Image src="/landing/buytoken.png" alt="Buy Token" priority={true} width={20} height={20} className="w-full h-[32vw] object-cover" />
            : <Image src="/landing/buynft.png" alt="Buy Token" priority={true} width={20} height={20} className="w-full h-[32vw] object-cover" />}
        </div>
        <div className="flex flex-col justify-start items-start w-[60%] space-y-16 ">
          <div className="text-6xl font-semibold bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">{useTitle}</div>
          <div className="flex flex-col w-full justify-center items-center ">
            <div className=" flex flex-row justify-around items-center w-[50%] h-[3vw] rounded-full border-[2px] border-blue-400 dark:border-white p-[2px] text-2xl font-semibold">
              <div onClick={handleToken} className={`cursor-pointer flex flex-row justify-center items-center w-[50%] h-full rounded-l-full ${isBuy ? "bg-indigo-400 text-white dark:bg-white/15" : ""}`}>Token</div>
              <div onClick={handleNft} className={`cursor-pointer flex flex-row justify-center items-center w-[50%] h-full rounded-r-full ${!isBuy ? "bg-indigo-400 text-white dark:bg-white/15" : ""}`}>NFT</div>
            </div>
          </div>
          <div>
            {
              isBuy ?
                <div className="space-y-1 break-words text-justify">
                  <p className="text-xl font-semibold">
                    New to the crypto market? No worries.</p>
                  <p>
                    {"Swap tokens effortlessly on our platform with a seamless and user-friendly interface. Whether you're a beginner or a seasoned trader, our platform makes it simple and secure to exchange tokens across multiple blockchains."}
                    <br />
                    Start swapping today and unlock endless possibilities in the crypto space.
                  </p>
                </div>
                :
                <div className="space-y-1 break-words text-justify">
                  <p className="text-xl font-semibold ">
                    New to the world of NFTs? Get started with just a few clicks.
                  </p>
                  <p>
                    {"Explore, collect, and sell NFTs effortlessly with our intuitive interface. Whether you're a collector or an artist, Exchange provides you with the tools to buy, sell, and showcase your NFTs in a trusted environment."}
                    <br />
                    {"Start your NFT journey today and discover a new world of digital ownership."}
                    <br />
                  </p>
                </div>
            }
          </div>
        </div>
      </div>
      <div className="relative select-none bg-black text-white flex flex-col px-[15vw] space-y-4 border-t-[0.5px] border-white/20 py-[2vw]">
        <div className="absolute inset-0 z-0 flex flex-row justify-center items-center bg-black/50">
          <video
            src="/landing/infovideo.mp4"
            autoPlay
            loop
            muted
            width="100%"
            height="auto"
            className="w-[100%] h-[100%] object-cover filter grayscale brightness-125 contrast-110 opacity-50"
          />
        </div>
        <div className="z-10 flex flex-row justify-start items-center text-6xl font-semibold bg-gradient-to-br from-white via-indigo-500 to-purple-500 bg-clip-text text-transparent">{cardTitle1}</div>
        <div className="z-10 flex flex-row justify-start items-center text-6xl font-semibold bg-gradient-to-br from-white via-indigo-500 to-purple-500 bg-clip-text text-transparent">{cardTitle2}</div>
        <div className="z-10 flex flex-row py-[2vw] space-x-[1.2vw]">
          <div className="flex flex-col w-1/3 space-y-[1.2vw]">
            <div className="relative rounded-2xl shadow-md w-full h-[28vw]">
              <Image src="/landing/creator.png" alt="info" priority={true} width={20} height={20} className="w-full h-full rounded-2xl object-cover pb-[1px]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start px-[10%] py-[5%] hover:py-[10%] border-[0.1px] border-white/15 hover:shadow-sm hover:border-blue-300 transform transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 ">
                <p className="text-6xl font-medium bg-gradient-to-br from-white to-blue-500  bg-clip-text text-transparent">30K+</p>
                <p className="text-2xl font-medium opacity-80 bg-gradient-to-br from-white via-blue-500 to-purple-500  bg-clip-text text-transparent">Total Contract Creators</p>
              </div>
            </div>
            <div className="relative rounded-2xl shadow-md w-full h-[28vw]">
              <Image src="/landing/nft.png" alt="info" priority={true} width={20} height={20} className="w-full h-full rounded-2xl object-cover pb-[1px]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start px-[10%] py-[5%] hover:py-[10%] border-[0.1px] border-white/15 hover:shadow-sm hover:border-blue-300 transform transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 ">
                <p className="text-6xl font-medium bg-gradient-to-br from-white to-blue-500  bg-clip-text text-transparent">20K+</p>
                <p className="text-2xl font-medium opacity-80 bg-gradient-to-br from-white via-blue-500 to-purple-500  bg-clip-text text-transparent">NFT Sales Volume</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3 space-y-[1.2vw] pt-[9vw]">
            <div className="relative rounded-2xl shadow-md w-full h-[28vw]">
              <Image src="/landing/address.png" alt="info" priority={true} width={20} height={20} className="w-full h-full rounded-2xl object-cover pb-[1px]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start px-[10%] py-[5%] hover:py-[10%] border-[0.1px] border-white/15 hover:shadow-sm hover:border-blue-300 transform transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 ">
                <p className="text-6xl font-medium bg-gradient-to-br from-white to-blue-500  bg-clip-text text-transparent">300.20M+</p>
                <p className="text-2xl font-medium opacity-80 bg-gradient-to-br from-white via-blue-500 to-purple-500  bg-clip-text text-transparent ">Unique Addresses</p>
              </div>
            </div>
            <div className="relative rounded-2xl shadow-md w-full h-[28vw]">
              <Image src="/landing/tax.png" alt="info" priority={true} width={20} height={20} className="w-full h-full rounded-2xl object-cover pb-[1px]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start px-[10%] py-[5%] hover:py-[10%] border-[0.1px] border-white/15 hover:shadow-sm hover:border-blue-300 transform transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 ">
                <p className="text-6xl font-medium bg-gradient-to-br from-white to-blue-500  bg-clip-text text-transparent">~$0.03%</p>
                <p className="text-2xl font-medium opacity-80 bg-gradient-to-br from-white via-blue-500 to-purple-500  bg-clip-text text-transparent ">Avg. Cost per txn</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3 space-y-[1.2vw]">
            <div className="relative border-[0.5px] border-white/5 rounded-2xl shadow-md w-full h-[28vw]">
              <Image src="/landing/transaction.png" priority={true} alt="info" width={20} height={20} className="w-full h-full rounded-2xl object-cover pb-[1px]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start px-[10%] py-[5%] hover:py-[10%] border-[0.1px] border-white/15 hover:shadow-sm hover:border-blue-300 transform transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 ">
                <p className="text-6xl font-medium bg-gradient-to-br from-white to-blue-500  bg-clip-text text-transparent">5.55B+</p>
                <p className="text-2xl font-medium opacity-80 bg-gradient-to-br from-white via-blue-500 to-purple-500  bg-clip-text text-transparent ">Transactions</p>
              </div>
            </div>
            <div className="relative rounded-2xl shadow-md w-full h-[28vw]">
              <Image src="/landing/contract.png" priority={true} alt="info" width={20} height={20} className="w-full h-full rounded-2xl object-cover pb-[1px]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start px-[10%] py-[5%] hover:py-[10%] border-[0.1px] border-white/15 hover:shadow-sm hover:border-blue-300 transform transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 ">
                <p className="text-6xl font-medium bg-gradient-to-br from-white to-blue-500  bg-clip-text text-transparent">500+</p>
                <p className="text-2xl font-medium opacity-80 bg-gradient-to-br from-white via-blue-500 to-purple-500  bg-clip-text text-transparent ">Deployed Smart Contracts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="select-none flex flex-col px-[20vw] space-y-4 border-t-[0.5px] border-white/20 py-[2vw]">
        <div className="flex flex-col justify-center items-center text-6xl font-semibold p-[2vw]">{faqsTitle}</div>
        <Accordion type="single" collapsible className=" space-y-2">
          {faqs.map(({ title, content }, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="hover:bg-secondary/30 dark:hover:bg-white/10 shadow-sm dark:bg-white/5 border-[0.5px] dark:border-white/15 px-[2vw] rounded-2xl no-underline">
              <AccordionTrigger className="text-xl font-semibold !no-underline">{title}</AccordionTrigger>
              <AccordionContent className="text-lg break-words text-justify" >{content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}