// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {LiquidityPool} from "./LiquidityPool.sol";
import {LiquidityPoolETH} from "./LiquidityPoolETH.sol";

contract OrderLimit {
    uint256 public counter;
    struct Order {
        address from;
        address pool;
        address token1;
        address token2;
        uint256 amount;
        uint256 reserve;
        string status;
    }
    Order[] public orders;

    event OrderCreated(
        address indexed from,
        address indexed to,
        address indexed pool,
        address token,
        uint256 amount,
        uint256 reserve
    );

    event ExchangedOrder(
        uint256 orderId,
        address indexed from,
        address indexed to,
        address indexed pool,
        address token,
        uint256 amount,
        uint256 amountOut
    );

    event CancelOrder(
        uint orderId,
        address indexed from,
        address indexed to,
        address token,
        uint256 amount
    );

    event ReceivedEther(address from, address to, uint256 amount);

    constructor() {
        counter = 0;
    }

    receive() external payable {
        emit ReceivedEther(msg.sender, address(this), msg.value);
    }

    function createOrder(
        address _pool,
        address _token1,
        address _token2,
        uint256 _amount,
        uint256 _reserve
    ) external payable returns (uint256 orderId) {
        require(_pool != address(0), "ADDRESS POOL ZERO");
        require(
            _amount > 0 || msg.value > 0,
            "Amount must be greater than zero"
        );

        if (_amount > 0) {
            require(
                ERC20(_token1).allowance(msg.sender, address(this)) >= _amount,
                "Insufficient token allowance token"
            );
            ERC20(_token1).transferFrom(msg.sender, address(this), _amount);
        }

        orders.push(
            Order({
                from: msg.sender,
                pool: _pool,
                token1: _token1,
                token2: _token2,
                amount: _amount > 0 ? _amount : msg.value,
                reserve: _reserve,
                status: "Pending"
            })
        );
        orderId = counter++;

        emit OrderCreated(
            msg.sender,
            address(this),
            _pool,
            _token1,
            _amount,
            _reserve
        );
    }

    function exchangedOrder(
        uint256 _id
    ) external payable returns (uint256 amountOut) {
        Order memory order = orders[_id];
        require(
            keccak256(abi.encodePacked(order.status)) ==
                keccak256(abi.encodePacked("Pending")),
            "Order has exchanged"
        );

        if (order.token1 == address(0) || order.token2 == address(0)) {
            LiquidityPoolETH pool = LiquidityPoolETH(payable(order.pool));
            if (order.token1 == address(0)) {
                amountOut = pool.swapToken{value: order.amount}(
                    order.token1,
                    0
                );
                ERC20(order.token2).transfer(order.from, amountOut);
            } else {
                ERC20(order.token1).approve(order.pool, order.amount);
                require(
                    ERC20(order.token1).allowance(address(this), order.pool) >=
                        order.amount,
                    "Allowance is not sufficient"
                );
                amountOut = pool.swapToken(order.token1, order.amount);
                payable(order.from).transfer(amountOut);
            }
        } else {
            LiquidityPool pool = LiquidityPool(order.pool);
            ERC20(order.token1).approve(order.pool, order.amount);
            amountOut = pool.swapToken(order.token1, order.amount);
            ERC20(order.token2).transfer(order.from, amountOut);
        }

        orders[_id].status = "Completed";
        emit ExchangedOrder(
            _id,
            address(this),
            order.from,
            order.pool,
            order.token1,
            order.amount,
            amountOut
        );
    }

    function cancelOrder(uint256 _id) external {
        Order memory order = orders[_id];
        require(
            keccak256(abi.encodePacked(order.status)) ==
                keccak256(abi.encodePacked("Pending")),
            "Order has exchanged"
        );
        if (order.token1 == address(0)) {
            payable(order.from).transfer(order.amount);
        } else {
            ERC20(order.token1).transfer(order.from, order.amount);
        }

        orders[_id].status = "Failer";
        emit CancelOrder(
            _id,
            address(this),
            order.from,
            order.token1,
            order.amount
        );
    }
}
