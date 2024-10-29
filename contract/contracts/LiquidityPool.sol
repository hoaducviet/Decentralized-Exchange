// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {LPToken} from "./LPToken.sol";

contract LiquidityPool {
    address public token1;
    address public token2;
    uint256 public reserve1;
    uint256 public reserve2;
    uint256 public totalLiquidityPool;
    LPToken public lpToken;

    mapping(address => uint256) public liquidity;

    event LiquidityAdded(
        address indexed provider,
        uint256 amount1,
        uint256 amount2,
        uint256 liquidityTokens
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 amount1,
        uint256 amount2,
        uint256 liquidityTokens
    );
    event TokensSwapped(
        address indexed provider,
        address indexed fromToken,
        address indexed toToken,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address _token1, address _token2) {
        token1 = _token1;
        token2 = _token2;

        string memory nameToken1 = ERC20(_token1).name();
        string memory nameToken2 = ERC20(_token2).name();
        string memory symbolToken1 = ERC20(_token1).symbol();
        string memory symbolToken2 = ERC20(_token2).symbol();

        string memory combinedName = string(
            abi.encodePacked(nameToken1, " - ", nameToken2)
        );
        string memory combinedSymbol = string(
            abi.encodePacked(symbolToken1, "/", symbolToken2)
        );

        lpToken = new LPToken(combinedName, combinedSymbol, address(this));
    }

    function addLiquidity(
        uint256 amount1,
        uint256 amount2
    ) external returns (uint256 liquidityTokens) {
        require(
            amount1 > 0 && amount2 > 0,
            "Amounts must be greater than zero"
        );

        require(
            ERC20(token1).allowance(msg.sender, address(this)) >= amount1,
            "Insufficient token allowance token1"
        );

        require(
            ERC20(token2).allowance(msg.sender, address(this)) >= amount2,
            "Insufficient token allowance token2"
        );

        //Transfer token from provider to address contract
        ERC20(token1).transferFrom(msg.sender, address(this), amount1);
        ERC20(token2).transferFrom(msg.sender, address(this), amount2);

        uint256 amount1Used = amount1;
        uint256 amount2Used = amount2;

        //Estimate number of liquidity tokens send to provider
        if (reserve1 == 0 && reserve2 == 0) {
            liquidityTokens = sqrt(amount1 * amount2);
        } else {
            uint256 optinmalAmount1 = (amount2 * reserve1) / reserve2;
            uint256 optinmalAmount2 = (amount1 * reserve2) / reserve1;

            if (amount1 > optinmalAmount1) {
                amount1Used = optinmalAmount1;
            } else {
                amount2Used = optinmalAmount2;
            }

            liquidityTokens = min(
                (amount1Used * reserve2) / reserve1,
                (amount2Used * reserve1) / reserve2
            );
        }

        reserve1 += amount1Used;
        reserve2 += amount2Used;
        totalLiquidityPool += liquidityTokens;
        liquidity[msg.sender] += liquidityTokens;

        lpToken.mint(msg.sender, liquidityTokens);

        if (amount1 > amount1Used) {
            ERC20(token1).transfer(msg.sender, amount1 - amount1Used);
        }
        if (amount2 > amount2Used) {
            ERC20(token2).transfer(msg.sender, amount2 - amount2Used);
        }

        emit LiquidityAdded(msg.sender, amount1, amount2, liquidityTokens);
    }

    function removeLiquidity(
        uint256 liquidityTokens
    ) public returns (uint256 amount1, uint256 amount2) {
        uint256 totalLiquidityProvider = liquidity[msg.sender];
        require(
            liquidityTokens <= totalLiquidityProvider,
            "Not enough liquidity"
        );

        amount1 = (liquidityTokens * reserve1) / totalLiquidityPool;
        amount2 = (liquidityTokens * reserve2) / totalLiquidityPool;

        reserve1 -= amount1;
        reserve2 -= amount2;
        totalLiquidityPool -= liquidityTokens;
        liquidity[msg.sender] -= liquidityTokens;

        ERC20(token1).transfer(msg.sender, amount1);
        ERC20(token2).transfer(msg.sender, amount2);

        lpToken.burn(msg.sender, liquidityTokens);

        emit LiquidityAdded(msg.sender, amount1, amount2, liquidityTokens);
    }

    function swapToken(
        address fromToken,
        uint256 amountIn
    ) public returns (uint256 amountOut) {
        require(fromToken == token1 || fromToken == token2, "Invalid token");

        if (fromToken == token1) {
            amountOut = getAmountOutSwapToken(amountIn, reserve1, reserve2);
            ERC20(token1).transferFrom(msg.sender, address(this), amountIn);
            ERC20(token2).transfer(msg.sender, amountOut);

            reserve1 += amountIn;
            reserve2 -= amountOut;
        } else {
            amountOut = getAmountOutSwapToken(amountIn, reserve2, reserve1);
            ERC20(token2).transferFrom(msg.sender, address(this), amountIn);
            ERC20(token1).transfer(msg.sender, amountOut);

            reserve1 -= amountOut;
            reserve2 += amountIn;
        }

        emit TokensSwapped(
            msg.sender,
            fromToken,
            fromToken == token1 ? token1 : token2,
            amountIn,
            amountOut
        );
    }

    // Calculate sqrt of uint using methods Babylonian
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }

    function getAmountOutSwapToken(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        uint256 amountInWithFee = amountIn * 995; //Fee is 5% per a transaction swap token
        return
            (amountInWithFee * reserveOut) /
            (reserveIn * 1000 + amountInWithFee);
    }
}
