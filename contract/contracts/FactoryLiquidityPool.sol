// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./LiquidityPool.sol";

contract FactoryLiquidityPool {
    mapping(address => mapping(address => address)) getPool;
    address[] public allPools;

    event PoolCreated(
        address indexed token1,
        address indexed token2,
        address pool,
        uint256 pollCount
    );

    function createLiquidityPool(
        address token1,
        address token2
    ) external returns (address pool) {
        require(token1 != token2, "IDENTICAL_ADDRESS");
        require(token1 != address(0) && token2 != address(0), "ZERO_ADDRESS");
        require(getPool[token1][token2] == address(0), "POOL_EXISTS");

        pool = address(new LiquidityPool(token1, token2));

        getPool[token1][token2] = pool;
        getPool[token2][token1] = pool;
        allPools.push(pool);

        emit PoolCreated(token1, token2, pool, allPools.length);
    }

    function allPoolsLength() external view returns (uint256) {
        return allPools.length;
    }

    function getPoolAddress(
        address token1,
        address token2
    ) external view returns (address) {
        return getPool[token1][token2];
    }
}
