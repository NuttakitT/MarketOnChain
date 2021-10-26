// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Market {
    event eventStuff(
        address owner,
        uint256 indexed id,
        uint256 indexed date,
        uint256 price,
        bool indexed sell
    );
    uint256 allStuff = 0;

    function getAllStuff() external view returns(uint256) {
        return allStuff;
    }

    // Create a new event of the item.
    function registedNewStuff(uint256 id, uint256 _price) external {
        emit eventStuff(msg.sender, id, now, _price, true);
        if(allStuff <= id) allStuff = id+1;
    }

    // Craete the new event of the item that set sell to true.
    function registedMyStuff(uint256 id, uint256 _price) external {
        emit eventStuff(msg.sender, id, now, _price, true);
    }

    // Craete the new event of the item that set sell to true.
    function unregistedMyStuff(uint256 id, uint256 _price) external {
        emit eventStuff(msg.sender, id, now, _price, false);
    }

    // Get the last event of that item to pay to its owner
    // before create a new event.
    function buyStuff(uint256 id, uint256 _price) external payable {
        emit eventStuff(msg.sender, id, now, _price, false);
    }
}
