// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {TokenERC20} from "./TokenERC20.sol";

contract FactoryToken {
    struct Token {
        string name;
        string symbol;
        string img;
        uint8 decimals;
        address owner;
        address tokenAddress;
    }

    Token[] public allTokens;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply
    );

    event MINTUSD(address _to, address tokenAddress, uint256 _amount);
    event BURNUSD(address _from, address tokenAddress, uint256 _amount);

    function createToken(
        string memory name,
        string memory symbol,
        string memory img,
        uint8 decimals,
        address initialOwner,
        uint256 initialSupply
    ) external {
        TokenERC20 newToken = new TokenERC20(
            name,
            symbol,
            initialOwner,
            initialSupply,
            decimals
        );

        allTokens.push(
            Token({
                name: name,
                symbol: symbol,
                img: img,
                decimals: decimals,
                owner: initialOwner,
                tokenAddress: address(newToken)
            })
        );

        emit TokenCreated(
            address(newToken),
            initialOwner,
            name,
            symbol,
            decimals,
            initialSupply
        );
    }

    function mintUSD(address _to, uint256 _amount) external {
        Token memory token;
        for (uint256 i = 0; i < allTokens.length; i++) {
            if (
                keccak256(abi.encodePacked(allTokens[i].symbol)) ==
                keccak256(abi.encodePacked("USD"))
            ) {
                token = allTokens[i];
                break;
            }
        }

        TokenERC20(token.tokenAddress).mintToken(_to, _amount);

        emit MINTUSD(_to, token.tokenAddress, _amount);
    }

    function burnUSD(address _from, uint256 _amount) external {
        Token memory token;
        for (uint256 i = 0; i < allTokens.length; i++) {
            if (
                keccak256(abi.encodePacked(allTokens[i].symbol)) ==
                keccak256(abi.encodePacked("USD"))
            ) {
                token = allTokens[i];
                break;
            }
        }

        TokenERC20(token.tokenAddress).burnToken(_from, _amount);
        emit BURNUSD(_from, token.tokenAddress, _amount);
    }

    function getAllTokens() external view returns (Token[] memory) {
        return allTokens;
    }
}
