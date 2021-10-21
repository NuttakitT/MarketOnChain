// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Market {
    address public owner;
    uint256 private index = 0;
    mapping(address => uint256) public balance;

    event registedEvent(uint256 indexed id, bool onSell);
    event unregistedEvent(uint256 indexed id, bool onSell);
    event changeOwner(uint256 indexed id, address newOwner);

    struct Stuff {
        address owner;
        uint256 id;
        string name;
        uint256 price;
        bool onSell;
    }

    Stuff[] public stuff;

    constructor() public {
        owner = msg.sender;
    }

    function getStuff(uint256 id)
        public
        view
        returns (
            string memory,
            uint256,
            bool
        )
    {
        return (stuff[id].name, stuff[id].price, stuff[id].onSell);
    }

    function registerNewStuff(string memory _name, uint256 _price) public {
        stuff[index].owner = msg.sender;
        stuff[index].id = index;
        stuff[index].name = _name;
        stuff[index].price = _price;
        stuff[index].onSell = true;
        emit registedEvent(index, stuff[index].onSell);
        index++;
    }

    function registedMyStuff(uint256 id) public {
        require(stuff[id].owner == msg.sender);
        stuff[id].onSell = true;
        emit registedEvent(id, stuff[id].onSell);
    }

    function unregistedMyStuff(uint256 id) public {
        require(stuff[id].owner == msg.sender);
        stuff[id].onSell = false;
        emit unregistedEvent(id, stuff[id].onSell);
    }

    function buyStuff(uint256 id) public payable {
        require(
            stuff[id].owner != msg.sender &&
                stuff[id].onSell &&
                balance[msg.sender] >= stuff[id].price
        );
        balance[msg.sender] = balance[msg.sender] - stuff[id].price;
        balance[stuff[id].owner] = balance[stuff[id].owner] + stuff[id].price;
        stuff[id].owner = msg.sender;
        emit changeOwner(id, msg.sender);
    }
}
