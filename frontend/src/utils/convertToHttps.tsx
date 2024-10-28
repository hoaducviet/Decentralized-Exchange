
interface Props {
    uri: string
}

const ipfsGateway = process.env.NEXT_PUBLIC_IPFSLINK;

export const convertToHttps = ({ uri }: Props) => {
    // Kiểm tra và xử lý đường dẫn bắt đầu bằng 'ipfs://'
    if (uri.startsWith("ipfs://")) {
        const ipfsHash = uri.split("ipfs://")[1];
        return ipfsGateway + ipfsHash;
    }

    // Kiểm tra xem đường dẫn có chứa 'ipfs/' không
    if (uri.includes("ipfs/")) {
        const ipfsHash = uri.split("ipfs/")[1];
        return ipfsGateway + ipfsHash;
    }

    // Nếu không phải là đường dẫn IPFS, trả về nguyên bản
    return uri;
}