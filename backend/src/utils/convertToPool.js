async function convertToPool(results) {
  const response = await results.map((item) => ({
    _id: item._id,
    name: item.name,
    address: item.address,
    addressLPT: item.address_lpt,
    token1: item.token1_id,
    token2: item.token2_id,
    totalLiquidity: item.total_liquidity,
    volume: item.volume,
  }));

  return response;
}

module.exports = { convertToPool };
