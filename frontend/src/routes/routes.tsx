import configRoutes from '@/config/configRoutes'


const publicRoutes = [
    { path: configRoutes.trade, content: 'Trade' },
    { path: configRoutes.explore, content: 'Explore' },
    { path: configRoutes.nfts, content: 'NFTs' },
    { path: configRoutes.pool, content: 'Pool' },
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
