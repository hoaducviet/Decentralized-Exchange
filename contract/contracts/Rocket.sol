// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Rocket {
    string public name;
    string public status;

    constructor(string memory _name) {
        name = _name;
        status = "ignition";
    }

    function launch() public {
        status = "lift-off";
    }
}
