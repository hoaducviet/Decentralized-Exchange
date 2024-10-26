// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {NFTCollection, ERC721} from "./NFTCollection.sol";

contract NFTMarket is Ownable {
    uint256 public counter;
    struct CollectionInfo {
        address collectionAddress;
        string name;
        string symbol;
    }
    mapping(uint256 => CollectionInfo) public collections;

    event CollectionCreated(
        address collectionAddress,
        address owner,
        string name,
        string symbol
    );

    event CollectionAdd(address collectionAddress, string name, string symbol);
    event CollectionRemove(
        address collectionAddress,
        string name,
        string symbol
    );

    constructor() Ownable(msg.sender) {
        counter = 0;
    }

    function createCollection(
        string memory _name,
        string memory _symbol
    ) public payable onlyOwner {
        NFTCollection newCollection = new NFTCollection(
            _name,
            _symbol,
            msg.sender
        );

        CollectionInfo memory newCollectionInfo = CollectionInfo({
            collectionAddress: address(newCollection),
            name: _name,
            symbol: _symbol
        });

        uint256 collectionId = counter++;
        collections[collectionId] = newCollectionInfo;

        emit CollectionCreated(
            address(newCollection),
            msg.sender,
            _name,
            _symbol
        );
    }

    function addCollection(address _collectionAddress) external payable {
        require(msg.value >= 1 ether, "Not enough fee add to market is 1 ETH");
        payable(msg.sender).transfer(msg.value);
        ERC721 newCollection = ERC721(_collectionAddress);

        CollectionInfo memory newCollectionInfo = CollectionInfo({
            collectionAddress: address(newCollection),
            name: newCollection.name(),
            symbol: newCollection.symbol()
        });

        uint256 collectionId = counter++;
        collections[collectionId] = newCollectionInfo;

        emit CollectionAdd(
            address(newCollection),
            newCollection.name(),
            newCollection.symbol()
        );
    }

    function removeCollection(uint256 _collectionId) public onlyOwner {
        require(counter > 0, "Not has an collection");
        uint256 collectionId = --counter;
        CollectionInfo memory collection = collections[_collectionId];
        collections[_collectionId] = collections[collectionId];

        emit CollectionRemove(
            collection.collectionAddress,
            collection.name,
            collection.symbol
        );
    }

    function getAllCollection() public view returns (CollectionInfo[] memory) {
        CollectionInfo[] memory allCollection = new CollectionInfo[](counter);
        for (uint256 i = 0; i < counter; i++) {
            allCollection[i] = collections[i];
        }

        return allCollection;
    }
}
