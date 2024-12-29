import { TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon, InstagramLogoIcon, DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const socials = [
    {
        Icon: TwitterLogoIcon,
        link: "https://x.com/jays27490",
    },
    {
        Icon: LinkedInLogoIcon,
        link: "https://www.linkedin.com/in/viethoaduc",
    },
    { 
        Icon: GitHubLogoIcon,
        link: "https://github.com/hoaducviet/Decentralized-Exchange",
    },
    {
        Icon: InstagramLogoIcon,
        link: "https://www.instagram.com/ducvieth_",
    },
    {
        Icon: DiscordLogoIcon,
        link: "https://discord.com/channels/1314910839651958784/1314910839651958787",
    },
]

const footerTitle = ["Product", "Exchange", "Protocol", "Partner", "Support"]
const footerContents = [
    {
        name: "Web app",
        link: ""
    },
    {
        name: "Exchange token",
        link: ""
    },
    {
        name: "Auto market",
        link: ""
    },
    {
        name: "Paypal",
        link: ""
    },
    {
        name: "Help center",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "Order limit",
        link: ""
    },
    {
        name: "Liquidity pool",
        link: ""
    },
    {
        name: "Metamask",
        link: ""
    },
    {
        name: "Contact us",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "Buy token",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "Coinbase",
        link: ""
    },
    {
        name: "Policy public",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: " Deposit usd",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "",
        link: ""
    },
    {
        name: "Withdraw usd",
        link: ""
    },
]

const ownerDescription = "2024 Dex, Inc. v1"
const devDescription = "Development by viethoaduc.com"

export default function Footer() {
    return <div className="select-none border-t-[0.5px] bg-white/30 dark:border-white/20 dark:bg-transparent flex flex-col justify-center items-center px-[15vw] h-[20vw] mt-[2vw] space-y-[1vw]">
        <div className="flex flex-col w-full justify-center items-start space-y-1">
            <Image src="/image/logo.png" alt="Logo" priority={true} width={20} height={20} className="w-[8vw] h-[2vw] object-cover" />
            <div className="flex flex-row w-full justify-start items-center space-x-1 text-xs opacity-80 px-10">
                <span>&copy;</span>
                <div >{ownerDescription}</div>
            </div>
        </div>
        <div className="flex flex-row w-full justify-start items-center space-x-4 px-10">
            {socials.map(({ Icon, link }, index) => (
                <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:shadow-xl opacity-80" >
                    <Icon className="w-[1vw] h-[1vw]" />
                </a>
            ))}
        </div>
        <div className="flex flex-col w-full justify-center items-center space-y-1 px-10">
            <div className="flex flex-row w-full justify-between text-xs opacity-90 items-center">
                <p className="flex flex-row justify-start w-[20%]">{footerTitle[0]}</p>
                <p className="flex flex-row justify-start w-[20%]">{footerTitle[1]}</p>
                <p className="flex flex-row justify-start w-[20%]">{footerTitle[2]}</p>
                <p className="flex flex-row justify-start w-[20%]">{footerTitle[3]}</p>
                <p className="flex flex-row justify-start w-[20%]">{footerTitle[4]}</p>
            </div>
            <div className="flex flex-wrap w-full justify-start items-center text-xs space-y-1">
                {footerContents.map((item, index) => (
                    <p key={index} className="cursor-pointer flex flex-row justify-start w-[20%] opacity-70 hover:opacity-100">{item.name}</p>
                ))}
            </div>
        </div>
        <div className="flex flex-row w-full justify-start items-center space-x-1 text-xs opacity-80 px-10">
            {devDescription}
        </div>
    </div>
}