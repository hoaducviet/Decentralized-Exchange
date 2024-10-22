import { Contract } from "ethers";

export type Address = `0x${string}`

export type Token = {
    name: string;
    symbol: string;
    img: string;
    decimals: number;
    owner: Address;
    address: Address;
}

export type Pool = {
    name: string;
    address: Address;
    addressLPT: Address;
    decimals1: number;
    addressToken1: Address;
    decimals2: number;
    addressToken2: Address;
}

export type Balance = {
    value: number | bigint | undefined;
    symbol: string | undefined;
    formatted: number | string;
    decimals: number;
}


export type TokenBalancesType = {
    info: Token;
    balance: Balance | undefined;
}

export type InfoPool = Pool & {
    token1: Token | undefined;
    token2: Token | undefined;
}

export type LiquidBalancesType = {
    info: InfoPool;
    balance: Balance | undefined;
}

export type Contracts = {
    look: Contract;
}
export type Children = React.ReactNode