import configRoutes from '@/config/configRoutes'


const publicRoutes = [
    { path: configRoutes.home, content: '' },
    { path: configRoutes.swap, content: 'Swap' },
    { path: configRoutes.explore, content: 'Explore' },
    { path: configRoutes.nft, content: 'NFT' },
    { path: configRoutes.pool, content: 'Pool' },
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
