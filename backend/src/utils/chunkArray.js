function chunkArray(array, size) {
  // Kiểm tra và xử lý đường dẫn bắt đầu bằng 'ipfs://'
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

module.exports = { chunkArray };
