// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./LiquidityPool.sol";
import "./LiquidityPoolETH.sol";

contract FactoryLiquidityPool {
    struct PoolInfo {
        string poolName;
        address poolAddress;
        address lpt;
        uint8 decimals1;
        address token1;
        uint8 decimals2;
        address token2;
    }
    PoolInfo[] public allPoolsInfo;
    mapping(address => mapping(address => address)) pools;

    event PoolCreated(
        address indexed token1,
        address indexed token2,
        address poolAddress,
        uint256 poolCount
    );

    function createLiquidityPool(
        address token1,
        address token2
    ) external returns (address) {
        require(token1 != address(0) && token2 != address(0), "ADDRESS ZERO");
        require(token1 != token2, "IDENTICAL_ADDRESS");
        require(pools[token1][token2] == address(0), "POOL_EXISTS");

        LiquidityPool newPool = new LiquidityPool(token1, token2);

        pools[token1][token2] = address(newPool);
        pools[token2][token1] = address(newPool);

        allPoolsInfo.push(
            PoolInfo({
                poolName: newPool.lpToken().symbol(),
                poolAddress: address(newPool),
                lpt: address(newPool.lpToken()),
                decimals1: ERC20(token1).decimals(),
                token1: token1,
                decimals2: ERC20(token2).decimals(),
                token2: token2
            })
        );

        emit PoolCreated(token1, token2, address(newPool), allPoolsInfo.length);

        return address(newPool);
    }

    function createLiquidityPoolETH(
        address token1
    ) external payable returns (address) {
        require(token1 != address(0), "IDENTICAL_ADDRESS");
        require(pools[token1][address(0)] == address(0), "POOL_EXISTS");

        LiquidityPoolETH newPool = new LiquidityPoolETH(token1);

        pools[token1][address(0)] = address(newPool);
        pools[address(0)][token1] = address(newPool);

        allPoolsInfo.push(
            PoolInfo({
                poolName: newPool.lpToken().symbol(),
                poolAddress: address(newPool),
                lpt: address(newPool.lpToken()),
                decimals1: ERC20(token1).decimals(),
                token1: token1,
                decimals2: 18,
                token2: address(0)
            })
        );

        emit PoolCreated(
            token1,
            address(0),
            address(newPool),
            allPoolsInfo.length
        );

        return address(newPool);
    }

    function getAllPool() external view returns (PoolInfo[] memory) {
        return allPoolsInfo;
    }
}
