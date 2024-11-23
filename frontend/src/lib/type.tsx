
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
    token1_id?: Token;
    token2_id?: Token;
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

export type OrderIdPay = {
    address: Address;
    value: string;
}
export type Payout = {
    address: Address;
    value: string;
    email: string;
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
    price: string;
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
    pool_id: string;
    reserve1: string;
    reserve2: string;
    info: Pool;
    createdAt: string;
}

export type CollectionItem = {
    nfts: NFT[];
    listed: NFT[];
    mylist: NFT[];
}

export type TokenTransaction = {
    _id?: string;
    type: string;
    from_wallet: Address;
    to_wallet: Address;
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

export type LiquidityTransaction = {
    _id?: string;
    type: string;
    wallet: Address;
    pool_id: string;
    token1_id: string;
    token2_id: string;
    amount_token1?: string;
    amount_token2?: string;
    amount_lpt?: string;
    price?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
}

export type USDTransaction = {
    _id?: string;
    type: string;
    method: string;
    wallet: Address;
    amount: string;
    currency: string;
    order_id?: string;
    invoice_id?: string;
    payer_email: string;
    payee_email?: string;
    price?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    notes?: string;
}

export type NFTTransaction = {
    _id?: string;
    type: string;
    from_wallet: Address;
    to_wallet?: Address;
    collection_id: string;
    nft_id: string;
    price?: string;
    currency?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
}

export type NFTActiveTransaction = {
    _id?: string;
    type: string;
    from_wallet: Address;
    to_wallet?: Address;
    collection_id: Collection;
    nft_id: string;
    price?: string;
    currency?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    createdAt: string;
}


export type TokenActiveTransaction = {
    _id?: string;
    type: string;
    from_wallet: Address;
    to_wallet?: Address;
    from_token_id: Token;
    to_token_id?: Token;
    amount_in: string;
    amount_out?: string;
    price?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    createdAt: string;
}

export type LiquidityActiveTransaction = {
    _id?: string;
    type: string;
    wallet: Address;
    pool_id: Pool;
    token1_id: Token;
    token2_id: Token;
    amount_token1?: string;
    amount_token2?: string;
    amount_lpt?: string;
    price: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    createdAt: string;
}

export type USDActiveTransaction = {
    _id?: string;
    type: string;
    method: string;
    wallet: Address;
    amount: string;
    currency: string;
    order_id?: string;
    invoice_id?: string;
    payer_email: string;
    payee_email?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    notes?: string;
    createdAt: string;
}
export type NFTItem = {
    listed: NFTActiveTransaction[] | [],
    prices: NFTActiveTransaction[],
    actives: NFTActiveTransaction[],
}

export type ActivesType = TokenActiveTransaction | LiquidityActiveTransaction | USDActiveTransaction | NFTActiveTransaction;

export type Children = React.ReactNode