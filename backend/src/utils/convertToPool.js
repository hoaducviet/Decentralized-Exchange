async function convertToPool(results) {
  const response = await results.map((item) => ({
    _id: item._id,
    name: item.name,
    address: item.address,
    addressLPT: item.address_lpt,
    token1: item.token1_id,
    token2: item.token2_id,
    total_tvl: item.total_tvl,
    tvl_day: item.tvl_day,
    volume_day: item.volume_day,
    volume_week: item.volume_week,
  }));

  return response;
}

module.exports = { convertToPool };
