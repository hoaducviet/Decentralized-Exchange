// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 public counter;
    address public ownerCollection;

    struct NFTInfo {
        uint256 id;
        uint256 price;
        string uri;
    }

    NFTInfo[] public listed;
    mapping(uint256 => NFTInfo) public nfts;

    event NFTCreated(address to, uint256 tokenId, string tokenURI);
    event NFTBought(address buyer, uint256 tokenId, uint256 price);
    event NFTTransfer(address receiver, uint256 nftId);
    event NFTListed(uint256 tokenId, uint256 price);
    event NFTListedRemove(address owner, uint256 tokenId);

    constructor(
        string memory _name,
        string memory _symbol,
        address _initialOwner
    ) Ownable(_initialOwner) ERC721(_name, _symbol) {
        counter = 0;
        ownerCollection = _initialOwner;
    }

    function createNFT(address _to, string memory _tokenURI) public onlyOwner {
        uint256 tokenId = ++counter;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        NFTInfo memory newNFT = NFTInfo({
            id: tokenId,
            price: 0,
            uri: _tokenURI
        });

        nfts[tokenId] = newNFT;

        emit NFTCreated(_to, tokenId, _tokenURI);
    }

    function buyNFT(uint256 _tokenId) external payable {
        require(msg.value > 0, "Amount must be greater than zero");
        NFTInfo storage nft = nfts[_tokenId];
        require(nft.price > 0, "NFT not listed");
        require(msg.value >= nft.price, "Amount not enough");
        require(_ownerOf(nft.id) != msg.sender, "You are owner");
        require(
            _isAuthorized(_ownerOf(nft.id), address(this), nft.id),
            "The token is not approved"
        );

        payable(msg.sender).transfer(msg.value);
        _safeTransfer(ownerOf(nft.id), msg.sender, nft.id);

        for (uint256 i = 0; i < listed.length; i++) {
            if (listed[i].id == _tokenId) {
                listed[i] = listed[listed.length - 1];
                listed.pop();
                break;
            }
        }

        emit NFTBought(msg.sender, nft.id, nft.price);
    }

    function transferNFT(address _to, uint256 _tokenId) public {
        require(_ownerOf(_tokenId) == msg.sender, "You are not owner");
        require(
            _isAuthorized(_ownerOf(_tokenId), address(this), _tokenId),
            "The token is not approved"
        );

        _safeTransfer(_ownerOf(_tokenId), _to, _tokenId);

        emit NFTTransfer(_to, _tokenId);
    }

    function listNFT(uint256 _tokenId, uint256 _newPrice) public {
        require(_ownerOf(_tokenId) == msg.sender, "You are not owner");
        approve(address(this), _tokenId);

        NFTInfo storage nft = nfts[_tokenId];
        nft.price = _newPrice;
        listed.push(nft);

        emit NFTListed(_tokenId, _newPrice);
    }

    function removeListedNFT(uint256 _tokenId) public {
        require(_ownerOf(_tokenId) == msg.sender, "You are not owner");

        for (uint256 i = 0; i < listed.length; i++) {
            if (listed[i].id == _tokenId) {
                listed[i] = listed[listed.length - 1];
                listed.pop();
                break;
            }
        }
        emit NFTListedRemove(msg.sender, _tokenId);
    }

    function getAllNFTInfo() public view returns (NFTInfo[] memory) {
        NFTInfo[] memory allNFT = new NFTInfo[](counter);

        for (uint256 i = 0; i < counter; i++) {
            allNFT[i] = nfts[i];
        }

        return allNFT;
    }

    function getAllListedInfo() public view returns (NFTInfo[] memory) {
        return listed;
    }
}
