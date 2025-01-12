export type User = {
    wallet: Address;
    walletAccess: boolean;
}

export type Account = {
    _id: string;
    address: Address;
    role: string;
    active: boolean;
    createdAt: string;
}

export type FileNFT = {
    token_id: number;
    token_uri: string;
}

export type FileCollection = {
    owner?: Address;
    uri: string;
    base_url: string;
    end_url: string;
    nfts: FileNFT[]
}

export type Address = `0x${string}`

export type Token = {
    _id: string;
    name: string;
    symbol: string;
    img: string;
    decimals: number;
    owner: Address;
    address: Address;
    price: string;
    price_reference: string;
    total_supply: string;
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
    total_tvl: string;
    tvl_day: string;
    volume_day: string;
    volume_week: string;
}

export type Balance = {
    value: string | undefined;
    symbol: string | undefined;
    formatted: string;
    decimals: number;
    total_supply: string;
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
    address: Address;
    owner: Address;
    name: string;
    symbol: string;
    category: string;
    logo: string;
    banner: string,
    verified: boolean;
    currency: string;
    project_url?: string;
    discord_url?: string;
    floor_price: string;
    highest_price: string;
    total_items: string;
    total_listed: string;
    total_owners: string;
    twitter_username: string;
    instagram_username: string;
    description: string;
    volume: string;
    createdAt: string;
    collection_logo?: string;
    collection_category?: string;
}

export type PendingCollection = {
    _id: string;
    owner: Address;
    name: string;
    symbol: string;
    logo: string;
    banner: string,
    category: string;
    currency: string;
    project_url?: string;
    discord_url?: string;
    total_items: string;
    total_listed: string;
    total_owners: string;
    twitter_username: string;
    instagram_username: string;
    description: string;
    admin_status: string;
    user_status: string;
    status: string;
    fee_expert: string;
    fee_mint: string;
    fee_market: string;
    total_fee: string;
    payment_expert: string;
    payment_fee: string;
    total_payed: string;
    createdAt: string;
}

export type NFT = {
    _id: string;
    collection_id: string,
    owner: Address;
    category: string;
    nft_id: string;
    name: string;
    uri: string;
    animation: string;
    img: string,
    price: string;
    formatted: string;
    isListed: boolean;
    description: string;
    has_physical: boolean;
    traits: Trait[] | []
}

export type PendingNFT = {
    _id: string;
    pending_collection_id: string;
    nft_id: string;
    name: string;
    uri: string;
    img: string;
    price: string;
    ai_price: string;
    expert_price: string;
    description: string;
    createdAt: string;
    traits: Trait[] | []
}

export type Trait = {
    trait_type: string;
    value: string;
}

export type UpdatePricePendingNFT = {
    pending_collection_id: string;
    nft_id: string;
    expert_price: string;
}

export type ExpertPriceNFT = {
    nft_id: string;
    expert_price: string;
}

export type FileContentUpdateExpertPriceNFT = {
    collection_id: string;
    nfts: ExpertPriceNFT[]
}

export type ReservePool = {
    pool_id: string;
    reserve1: string;
    reserve2: string;
    info: Pool;
    createdAt: string;
}

export type TokenPrice = {
    _id: string;
    token_id: string;
    price: string;
    createdAt: string;
}

export type Order = {
    _id?: string;
    type?: string;
    order_id?: number;
    from_wallet: Address;
    to_wallet: Address;
    pool_id: string;
    from_token_id: string;
    to_token_id: string;
    amount_in: string;
    amount_out?: string;
    price: string;
    status?: string;
    receipt_hash?: string;
    date?: string;
}


export type TokenTransaction = {
    _id?: string;
    type: string;
    from_wallet: Address;
    to_wallet: Address;
    pool_id?: string;
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
    percent_eth?: string;
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
    priceUsd?: string;
    currency?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    phone?: string;
    name?: string;
    address?: string;
    note?: string;
    pickup_deadline?: string;
    shipping_fee?: string;
    storage_fee?: string;
}

export type NFTActiveTransaction = {
    _id: string;
    type: string;
    from_wallet: Address;
    to_wallet?: Address;
    collection_id: Collection;
    nft_id: string;
    price?: string;
    priceUsd?: string;
    currency?: string;
    gas_fee?: string;
    network_fee?: string;
    platform_fee?: string;
    receipt_hash?: string;
    status?: string;
    phone?: string;
    name?: string;
    address?: string;
    note?: string;
    shipping_status?: string;
    pickup_deadline?: string;
    shipping_fee?: string;
    storage_fee?: string;
    createdAt: string;
}


export type TokenActiveTransaction = {
    _id?: string;
    type: string;
    from_wallet: Address;
    to_wallet?: Address;
    pool_id?: string;
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


export type OrderActiveTransaction = {
    _id: string;
    type: string;
    order_id: number;
    from_wallet: Address;
    to_wallet: Address;
    pool_id: Pool;
    from_token_id: Token;
    to_token_id: Token;
    amount_in: string;
    amount_out?: string;
    price: string;
    status: string;
    receipt_hash: string;
    expiredAt: string;
    createdAt: string;
}

export type CollectionTop = {
    collection: Collection;
    nfts: NFT[];
}

export type Volume = {
    date: string;
    volume: string;
    transaction_count: number;
}
export type TVL = {
    date: string;
    tvl: string;
}


export type City = string;

export type Country = {
    iso2: string;
    iso3: string;
    country: string;
    cities: City[]
}

export type ActivesType = TokenActiveTransaction | LiquidityActiveTransaction | USDActiveTransaction | NFTActiveTransaction | OrderActiveTransaction;
export type PoolTransactionsType = TokenActiveTransaction | LiquidityActiveTransaction
export type Children = React.ReactNode