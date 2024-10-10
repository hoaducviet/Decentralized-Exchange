export type Token = {
    ticker: string;
    img: string;
    name: string;
    address: `0x${string}`;
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

export type Children = React.ReactNode