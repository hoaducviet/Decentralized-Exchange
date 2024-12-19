// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {NFTCollection} from "./NFTCollection.sol";

contract MarketNFT is Ownable {
    uint256 public counter;
    struct CollectionInfo {
        address collectionAddress;
        address collectionOwner;
        string uri;
    }
    CollectionInfo[] private InfoCollections;
    mapping(address => uint256) public collections;

    event CollectionAdded(address owner, address collectionAddress);
    event CollectionRemoved(address collectionAddress);

    event NFTBought(
        address collection,
        address to,
        uint256 tokenId,
        uint256 price
    );
    event NFTTransfer(
        address collection,
        address from,
        address to,
        uint256 nftId
    );
    event NFTListed(
        address collection,
        address from,
        uint256 tokenId,
        uint256 price
    );
    event NFTListedRemove(address collection, address owner, uint256 tokenId);

    constructor() Ownable(msg.sender) {
        counter = 0;
    }

    function buyNFT(
        address _collectionAddress,
        uint256 _tokenId
    ) external payable {
        require(msg.value > 0, "Amount must be greater than zero");
        require(
            collections[_collectionAddress] != 0,
            "Collection does not exits"
        );
        uint256 price = NFTCollection(_collectionAddress).buyNFT{
            value: msg.value
        }(msg.sender, _tokenId);

        emit NFTBought(_collectionAddress, msg.sender, _tokenId, price);
    }

    function transferNFT(
        address _collectionAddress,
        address _to,
        uint256 _tokenId
    ) external {
        require(
            collections[_collectionAddress] != 0,
            "Collection does not exits"
        );
        NFTCollection collection = NFTCollection(_collectionAddress);
        collection.transferNFT(_to, _tokenId);

        emit NFTTransfer(_collectionAddress, msg.sender, _to, _tokenId);
    }

    function listNFT(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _newPrice
    ) external {
        require(
            collections[_collectionAddress] != 0,
            "Collection does not exits"
        );
        NFTCollection collection = NFTCollection(_collectionAddress);

        collection.listNFT(_tokenId, _newPrice);
        emit NFTListed(_collectionAddress, msg.sender, _tokenId, _newPrice);
    }

    function removeListedNFT(
        address _collectionAddress,
        uint256 _tokenId
    ) external {
        require(
            collections[_collectionAddress] != 0,
            "Collection does not exist"
        );
        NFTCollection(_collectionAddress).removeListedNFT(_tokenId);
        NFTCollection(_collectionAddress).approve(address(0), _tokenId);
        emit NFTListedRemove(_collectionAddress, msg.sender, _tokenId);
    }

    function addCollection(address _collectionAddress) external payable {
        require(
            collections[_collectionAddress] == 0,
            "Collection has been existed"
        );
        require(msg.value >= 1 ether, "Not enough fee add to market is 1 ETH");
        NFTCollection collection = NFTCollection(_collectionAddress);

        InfoCollections.push(
            CollectionInfo({
                collectionAddress: _collectionAddress,
                collectionOwner: collection.owner(),
                uri: collection.collectionURI()
            })
        );
        collections[_collectionAddress] = ++counter;

        emit CollectionAdded(collection.owner(), _collectionAddress);
    }

    function removeCollection(address _collectionAddress) public onlyOwner {
        require(
            collections[_collectionAddress] != 0,
            "Collection does not exits"
        );
        uint256 collectionId = collections[_collectionAddress] - 1;
        CollectionInfo memory collection = InfoCollections[collectionId];

        if (collectionId != counter - 1) {
            InfoCollections[collectionId] = InfoCollections[counter - 1];
            collections[
                InfoCollections[collectionId].collectionAddress
            ] = collectionId;
        }

        InfoCollections.pop();
        delete collections[_collectionAddress];
        counter--;
        emit CollectionRemoved(collection.collectionAddress);
    }

    function getAllActiveCollection()
        external
        view
        returns (CollectionInfo[] memory)
    {
        return InfoCollections;
    }
}
