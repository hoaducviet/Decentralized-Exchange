const ipfsGateway = process.env.IPFSLINK;

async function convertToHttps({uri}) {
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
  console.log(uri)
  return uri;
}

module.exports = { convertToHttps };
