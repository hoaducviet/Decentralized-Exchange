// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 public counter;
    string public collectionURI;
    string private _baseCollectionURI;
    struct NFTInfo {
        uint256 id;
        uint256 price;
        string uri;
        bool isListed;
        address owner;
    }
    struct NFTItem {
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => NFTItem) nfts;

    event NFTCreated(address to, uint256 tokenId, string tokenURI);
    event NFTBought(address buyer, uint256 tokenId, uint256 price);
    event NFTTransfer(address from, address to, uint256 nftId);
    event NFTListed(address from, uint256 tokenId, uint256 price);
    event NFTListedRemove(address owner, uint256 tokenId);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        string memory _baseUri,
        address _initialOwner
    ) Ownable(_initialOwner) ERC721(_name, _symbol) {
        counter = 0;
        collectionURI = _uri;
        _baseCollectionURI = _baseUri;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseCollectionURI;
    }

    function createNFT(
        address _to,
        string memory _tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = counter++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        nfts[tokenId] = NFTItem({price: 0, isListed: false});

        emit NFTCreated(_to, tokenId, _tokenURI);
        return tokenId;
    }

    function buyNFT(
        address _to,
        uint256 _tokenId
    ) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than zero");
        NFTItem storage nft = nfts[_tokenId];
        require(nft.isListed, "NFT not listed");
        require(
            ownerOf(_tokenId) == msg.sender ||
                isApprovedForAll(ownerOf(_tokenId), msg.sender),
            "Caller is not owner nor approved"
        );
        require(_ownerOf(_tokenId) != _to, "You are owner");
        require(msg.value >= nft.price, "Amount not enough");

        payable(ownerOf(_tokenId)).transfer(msg.value);
        _safeTransfer(ownerOf(_tokenId), _to, _tokenId);
        nft.isListed = false;

        emit NFTBought(_to, _tokenId, nft.price);
        return nft.price;
    }

    function transferNFT(address _to, uint256 _tokenId) public {
        require(
            ownerOf(_tokenId) == msg.sender ||
                isApprovedForAll(ownerOf(_tokenId), msg.sender),
            "Caller is not owner nor approved"
        );
        _safeTransfer(_ownerOf(_tokenId), _to, _tokenId);
        nfts[_tokenId].isListed = false;

        emit NFTTransfer(msg.sender, _to, _tokenId);
    }

    function listNFT(uint256 _tokenId, uint256 _newPrice) public {
        require(
            ownerOf(_tokenId) == msg.sender ||
                isApprovedForAll(ownerOf(_tokenId), msg.sender),
            "Caller is not owner nor approved"
        );

        nfts[_tokenId].price = _newPrice;
        nfts[_tokenId].isListed = true;

        emit NFTListed(msg.sender, _tokenId, _newPrice);
    }

    function removeListedNFT(uint256 _tokenId) public {
        require(
            ownerOf(_tokenId) == msg.sender ||
                isApprovedForAll(ownerOf(_tokenId), msg.sender),
            "Caller is not owner nor approved"
        );
        nfts[_tokenId].isListed = false;

        emit NFTListedRemove(msg.sender, _tokenId);
    }

    function getNFTInfo(uint256 _nftId) public view returns (NFTInfo memory) {
        NFTInfo memory nft = NFTInfo({
            id: _nftId,
            price: nfts[_nftId].price,
            uri: tokenURI(_nftId),
            isListed: nfts[_nftId].isListed,
            owner: ownerOf(_nftId)
        });
        return nft;
    }
}
