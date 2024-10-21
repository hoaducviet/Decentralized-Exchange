// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    uint8 decimal = 18;

    constructor(
        string memory nameERC20,
        string memory symbolERC20,
        address initialOwner,
        uint256 initialSupply,
        uint8 _decimal
    ) ERC20(nameERC20, symbolERC20) {
        decimal = _decimal;
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

    function decimals() public view virtual override returns (uint8) {
        return decimal;
    }
}
