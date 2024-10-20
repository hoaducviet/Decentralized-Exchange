import { Contract, AbiItem } from "web3";

export type Address = `0x${string}`

export type ETH = {
    name: string;
    symbol: string;
    img: string;
    decimals: number;
    address: Address;
}

export type Token = {
    name: string;
    symbol: string;
    img: string;
    decimals: number;
    owner: Address;
    address: Address;
}

export type Balance = {
    value: number | bigint | undefined;
    symbol?: string | undefined;
    formatted?: string;
    decimals?: number;
}

export type BalancesType = {
    token: Token | ETH;
    balance: Balance | undefined;
}

export type Contracts = {
    look: Contract<AbiItem[]>;
}
export type Children = React.ReactNode