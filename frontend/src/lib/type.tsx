
export type Address = `0x${string}`

export type Token = {
    _id: string;
    name: string;
    symbol: string;
    img: string;
    decimals: number;
    owner: Address;
    address: Address;
    volume: string;
}

export type Pool = {
    _id: string;
    name: string;
    address: Address;
    address_lpt: Address;
    token1: Token;
    token2: Token;
    total_liquidity: string;
    volume: string;
}

export type Balance = {
    value: number | bigint | undefined;
    symbol: string | undefined;
    formatted: string;
    decimals: number;
}

export type TokenBalancesType = {
    info: Token;
    balance: Balance | undefined;
}

export type LiquidBalancesType = {
    info: Pool;
    balance: Balance | undefined;
}

export type Collection = {
    _id: string;
    name: string;
    symbol: string;
    address: Address;
    owner: Address;
    total_supply: string;
    description: string;
    volume: string;
}

export type NFT = {
    address: Address;
    id: number;
    price: number;
    uri: string;
    isListed: boolean;
    owner: Address;
    formatted: string;
    img: string,
    name: string;
    description: string;
}
export type GetCollection = {
    address: Address | undefined;
    addressCollection: Address | undefined;
}

export type ReservePool = {
    reserve1: string;
    reserve2: string;
    info: Pool;
}

export type CollectionItem = {
    nfts: NFT[];
    listed: NFT[];
    mylist: NFT[];
}

export type TokenTransaction = {
    _id?: string;
    type?: string;
    from_wallet: Address;
    to_wallet?: Address;
    from_token_id: string;
    to_token_id?: string;
    amount_in: string;
    amount_out?: string;
    price?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
}

export type Children = React.ReactNode