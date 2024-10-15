// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(initialOwner, initialSupply);
    }

    function mintToken(
        address receiver,
        uint256 amount
    ) external returns (uint256) {
        require(amount > 0, "Amount cannot be negative");
        _mint(receiver, amount);
        return amount;
    }
}
