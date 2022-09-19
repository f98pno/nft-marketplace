// This file will be executed by Truffle

const truffleAssert = require('truffle-assertions');
const { ethers } = require("ethers"); 
const NftMarket = artifacts.require("NftMarket")

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();
    let _listingPrice = ethers.utils.parseEther("0.025").toString();

    before(async () => {
        _contract = await NftMarket.deployed();
        console.log(accounts);
    }) 

    describe("Mint token", () => {
        const tokenURI = "https://test.com"

        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        }) 

        it("owner of first token should be address[0]", async () => {
            const owner = await _contract.ownerOf(1);

            // 0xCA8cfA598627023A8783F845676234dAEb031421
            //assert(owner == accounts[0], "Owner of token is noth matching address[0]");
            assert.equal(owner, accounts[0], "Owner of token is noth matching address[0]");
        })

        it("first token should point to the correct tokenURI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);
            console.log("Token1: ", actualTokenURI);

            assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
        })

        it("should not be possible to create a NFT with used tokenURI", async () => {
            try {
                await _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0]
                })
            } catch (error) {
                assert(error, "NFT was minted with previosly used token")
            }

            // Does the same check as the function above
            await truffleAssert.fails(
                _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0]
                }),
                truffleAssert.ErrorType.REVERT,
                "Token URI already exists"
            );
        })

        it("should have one listed item", async () => {
            const listedItem = await _contract.listedItemsCount();

            assert.equal(listedItem.toNumber(), 1, "Listed items count is not 1");
        })

        it("should have create NFT item", async () => {
            const nftItem = await _contract.getNftItem(1);

            console.log(nftItem);

            assert.equal(nftItem.tokenId, 1, "Token id is not 1");
            assert.equal(nftItem.price, _nftPrice, "Nft price is not correct");
            assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
            assert.equal(nftItem.isListed, true, "Token is not listed");
        })
    })
    
    describe("Buy NFT", () => {
        before(async() => {
            await _contract.buyNft(1, {
                from: accounts[1],
                value: _nftPrice
            })
        })

        it("should unlist the item", async () => {
            const listedItem = await _contract.getNftItem(1);
            assert.equal(listedItem.isListed, false, "Item is still listed");
        })

        it("should decrease listed items count", async () => {
            const listedItemCount = await _contract.listedItemsCount();
            assert.equal(listedItemCount.toNumber(), 0, "Count has not been decremented");
        })

        it("should change the owner", async () => {
            const currentOwner = await _contract.ownerOf(1);
            assert.equal(currentOwner, accounts[1], "Item is not transferred to account[1]");
        })
    })
})