// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTERC721 is ERC721URIStorage, Ownable {
    uint256 public priceNFT;
    uint256 public idNFT;
    string uriNFT;

    event NFTMinted(uint256 nftId, address owner, string nftURI);
    event NFTTransfer(uint256 nftId, address sender, address receiver);
    event NFTBought(uint256 nftId, address buyer, uint256 price);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        uint256 _price,
        address _initialOwner
    ) Ownable(_initialOwner) ERC721(_name, _symbol) {
        priceNFT = _price;
        uriNFT = _uri;
    }

    function mintNFT(address _receiver, uint256 _idNFT) external onlyOwner {
        idNFT = _idNFT;
        _safeMint(_receiver, _idNFT);
        _setTokenURI(_idNFT, uriNFT);
        emit NFTMinted(_idNFT, _receiver, uriNFT);
    }

    function buyNFT(address buyer) public payable {
        require(priceNFT > 0, "Price must be greater than zero");
        require(msg.value >= priceNFT, "Incorrect Ether amount");
        address seller = owner();

        payable(seller).transfer(msg.value);
        _transfer(seller, buyer, idNFT);

        emit NFTBought(idNFT, buyer, priceNFT);
        priceNFT = 0;
    }

    function setPriceNFT(address provider, uint256 newPrice) external {
        require(provider == ownerOf(idNFT), "Not the owner");
        priceNFT = newPrice;
    }

    function transferNFT(address receiver) external onlyOwner {
        require(ownerOf(idNFT) == msg.sender, "Not the owner");
        _transfer(msg.sender, receiver, idNFT);

        emit NFTTransfer(idNFT, msg.sender, receiver);
    }
}
