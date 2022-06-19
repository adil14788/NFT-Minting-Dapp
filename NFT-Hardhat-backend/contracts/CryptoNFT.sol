// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhiteList.sol";

contract CryptoNFT is ERC721Enumerable, Ownable {
    string _baseTokenURI;

    IWhiteList whitelist;
    bool public preSaleStarted;
    uint public preSaleEnded;
    uint public maxTokenIds = 20;
    uint public totalTokenIds;
    uint public publicPrice = 0.01 ether;
    uint public presalePrice = 0.005 ether;
    bool public pauseMint;

    modifier onlyWhenNoPause() {
        require(pauseMint, "Minting has been paused ");
        _;
    }

    constructor(string memory _baseUri, address whiteListContract)
        ERC721("CryptoDev NFT", "CRD")
    {
        _baseTokenURI = _baseUri;
        whitelist = IWhiteList(whiteListContract);
    }

    function startPresale() public onlyOwner {
        preSaleStarted = true;
        preSaleEnded = block.timestamp + 5 minutes;
    }

    function preSaleMint() public payable onlyWhenNoPause {
        require(
            preSaleStarted && block.timestamp < preSaleEnded,
            "Presale ended"
        );
        require(
            whitelist.s_whiteListedAddress(msg.sender),
            "You are not white listed"
        );
        require(totalTokenIds < maxTokenIds, "All NFT are mnited");
        require(msg.value >= presalePrice, "Not enough token provided");

        totalTokenIds += 1;
        _safeMint(msg.sender, totalTokenIds);
    }

    function mint() public payable onlyWhenNoPause {
        require(
            preSaleStarted && block.timestamp >= preSaleEnded,
            "Pre Sale has not ended yet"
        );
        require(totalTokenIds < maxTokenIds, "All NFT are minted");
        require(msg.value >= publicPrice, "Not enough fund provided");
        totalTokenIds + 1;
        _safeMint(msg.sender, totalTokenIds);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        (bool success, ) = payable(_owner).call{value: address(this).balance}(
            ""
        );

        require(success, "Transaction Failed");
    }

    receive() external payable {}

    fallback() external payable {}
}
