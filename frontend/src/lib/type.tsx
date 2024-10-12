import { Contract, AbiItem } from "web3";

export type Address = `0x${string}`

export type Token = {
    ticker: string;
    img: string;
    name: string;
    address: Address;
    decimals: number;
}

export type Balance = {
    value: number | bigint | undefined;
    symbol?: string | undefined;
    formatted?: string;
    decimals?: number;
}

export type BalancesType = {
    token: Token;
    balance: Balance | undefined;
}

export type Contracts = {
    look: Contract<AbiItem[]>;
}
export type Children = React.ReactNode