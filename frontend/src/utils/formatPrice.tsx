
export const formatPrice = (num: number): string => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    } else if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    } else if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    } else if (num <= 0.001) {
        return `<0.001`;
    }
    return num?.toFixed(2).toString()
}