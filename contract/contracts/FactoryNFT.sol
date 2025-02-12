// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {NFTCollection} from "./NFTCollection.sol";

contract FactoryNFT is Ownable {
    uint256 public counter;
    struct CollectionInfo {
        address collectionAddress;
        string name;
        string symbol;
        string uri;
    }
    CollectionInfo[] public InfoCollections;
    mapping(address => uint256) private collections;

    event CollectionCreated(
        address collectionAddress,
        address owner,
        string name,
        string symbol
    );
    event MintedNFT(
        address collection,
        address to,
        uint256 tokenId,
        string tokenURI
    );

    event TransferOwnerCollection(address from, address to, address collection);

    constructor() Ownable(msg.sender) {
        counter = 0;
    }

    function createCollection(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        string memory _baseUri
    ) public onlyOwner {
        NFTCollection newCollection = new NFTCollection(
            _name,
            _symbol,
            _uri,
            _baseUri,
            address(this)
        );

        CollectionInfo memory newCollectionInfo = CollectionInfo({
            collectionAddress: address(newCollection),
            name: _name,
            symbol: _symbol,
            uri: _uri
        });

        collections[address(newCollection)] = ++counter;
        InfoCollections.push(newCollectionInfo);

        emit CollectionCreated(
            address(newCollection),
            address(this),
            _name,
            _symbol
        );
    }

    function mintNFT(
        address _collectionAddress,
        string memory _tokenURI,
        address _owner,
        uint256 _price
    ) external {
        require(
            collections[_collectionAddress] != 0,
            "Collection does not exits"
        );

        uint256 tokenId = NFTCollection(_collectionAddress).createNFT(
            _owner,
            _tokenURI,
            _price
        );

        emit MintedNFT(_collectionAddress, _owner, tokenId, _tokenURI);
    }

    function transferOwnerCollection(
        address _collection,
        address _newOwner
    ) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        NFTCollection collection = NFTCollection(_collection);
        require(
            _newOwner != collection.owner(),
            "New owner must be different from current owner"
        );
        require(
            address(this) == collection.owner(),
            "Factory contract not is owner of collection"
        );

        collection.transferOwnership(_newOwner);

        emit TransferOwnerCollection(address(this), _newOwner, _collection);
    }

    function getAllCollection()
        external
        view
        returns (CollectionInfo[] memory)
    {
        return InfoCollections;
    }
}
