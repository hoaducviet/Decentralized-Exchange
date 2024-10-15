// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFTERC721.sol";

contract NFTMarket is Ownable {
    struct NFTInfo {
        address contractAddress;
        uint256 nftId;
        uint256 price;
        string name;
        string symbol;
        string uri;
    }
    mapping(uint256 => NFTInfo) public nfts;
    uint256 public nftCounter;

    event NFTCreated(address contractAddress, address owner, uint256 price);
    event NFTBought(uint256 nftId, address buyer, uint256 price);
    event NFTListed(uint256 nftId, uint256 price);
    event NFTTransfer(uint256 nftId, address receiver);

    constructor(address initialOwner) Ownable(initialOwner) {
        nftCounter = 0;
    }

    function createNFT(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        uint256 _price
    ) public onlyOwner {
        require(_price > 0, "Price must be greater than zero");
        uint256 newNftId = nftCounter;

        NFTERC721 newNFT = new NFTERC721(
            _name,
            _symbol,
            _uri,
            _price,
            msg.sender
        );

        newNFT.mintNFT(msg.sender, newNftId);

        nfts[newNftId] = NFTInfo({
            contractAddress: address(newNFT),
            nftId: newNftId,
            price: _price,
            name: _name,
            symbol: _symbol,
            uri: _uri
        });

        emit NFTCreated(address(newNFT), msg.sender, _price);
        nftCounter += 1;
    }

    function buyNFT(uint256 nftId) external payable {
        NFTInfo storage nft = nfts[nftId];
        require(nft.price > 0, "Price must be greater than zero");
        require(msg.value >= nft.price, "Incorrect Ether amount");

        NFTERC721(nft.contractAddress).buyNFT{value: msg.value}(msg.sender);

        emit NFTBought(nftId, msg.sender, nft.price);
        nft.price = 0;
    }

    function transferNFT(uint256 nftId, address receiver) public {
        NFTInfo storage nft = nfts[nftId];

        require(
            NFTERC721(nft.contractAddress).ownerOf(nftId) == msg.sender,
            "Not the owner"
        );
        NFTERC721(nft.contractAddress).transferFrom(
            msg.sender,
            receiver,
            nftId
        );

        emit NFTTransfer(nftId, receiver);
    }

    function listNFT(uint256 nftId, uint256 newPrice) public {
        NFTInfo storage nft = nfts[nftId];
        require(nft.price > 0, "Price must be greater than zero");
        require(
            NFTERC721(nft.contractAddress).owner() == msg.sender,
            "Not the owner"
        );

        NFTERC721(nft.contractAddress).setPriceNFT(msg.sender, newPrice);
        nft.price = newPrice;

        emit NFTListed(nftId, newPrice);
    }

    function getNFTInfo(uint256 nftId) public view returns (NFTInfo memory) {
        return nfts[nftId];
    }
}
