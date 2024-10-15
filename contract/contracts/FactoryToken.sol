// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {TokenERC20} from "./TokenERC20.sol";

contract FactoryToken {
    address[] public allTokens;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol,
        uint256 initialSupply
    );

    function createToken(
        string memory name,
        string memory symbol,
        address initialOwner,
        uint256 initialSupply
    ) public {
        TokenERC20 newToken = new TokenERC20(
            name,
            symbol,
            initialOwner,
            initialSupply
        );

        allTokens.push(address(newToken));

        emit TokenCreated(
            address(newToken),
            initialOwner,
            name,
            symbol,
            initialSupply
        );
    }

    function getAllTokens() public view returns (address[] memory) {
        return allTokens;
    }
}
