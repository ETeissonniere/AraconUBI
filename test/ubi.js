const { balance, BN, constants, expect, expectEvent, send, shouldFail, time } = require('openzeppelin-test-helpers')
const Ubi = artifacts.require("Ubi.sol")
const UbiToken = artifacts.require("UbiToken.sol")

contract("ubi", ([owner, holder, nonHolder]) => {
    describe("Deployment", () => {
        it("deploys", async () => {
            this.token = await UbiToken.new()
            await this.token.mint(holder, 1000)

            this.endBlock = (await time.latestBlock()).add(new BN(20))
            this.ubi = await Ubi.new(this.token.address, this.endBlock)
        })

        it("should start in contribution period", async () => {
            expect(await this.ubi.period()).to.be.a.bignumber.that.is.zero
        })

        it("configured period switching block", async () => {
            expect(await this.ubi.endCollectionPeriod()).to.be.a.bignumber.that.is.equal(this.endBlock)
        })
    })

    describe("Contribution period", () => {
        it("accepts receiving ETH", async () => {
            await send.ether(holder, this.ubi.address, 1000) // in wei
        })

        it("refuse calling collection function", async () => {
            await shouldFail.reverting.withMessage(this.ubi.collect(), "Bad period")
        })

        it("advance time", async () => {
            while ((await time.latestBlock()).lt(this.endBlock)) {
                await time.advanceBlock()
            }
        })

        it("refuse contributions after contribution period ended", async () => {
            await shouldFail.reverting(send.ether(holder, this.ubi.address, 1000))
        })
    })

    describe("Collection period", () => {
        it("switched to collection period", async () => {
            expect(await this.ubi.period()).to.be.a.bignumber.that.equals(new BN(1))
        })

        describe("Non token holder", () => {
            it("refuse call", async () => {
                await shouldFail.reverting.withMessage(this.ubi.collect({ from: nonHolder }), "Not a token holder")
            })
        })

        describe("Token holder", () => {
            it("allows contract to take tokens", async () => {
                await this.token.approve(
                    this.ubi.address,
                    await this.token.balanceOf(holder),
                    { from: holder })
            })

            it("calls collection function", async () => {
                this.balanceBefore = await balance.current(holder)
                await this.ubi.collect({ from: holder })
                this.balanceAfter = await balance.current(holder)
            })

            it("sent the ETH", async () => {
                expect(this.balanceAfter.sub(this.balanceBefore)).to.be.a.bignumber.that.is.not.zero

                // Holder has 100% shares
                expect(await balance.current(this.ubi.address)).to.be.a.bignumber.that.is.zero
            })

            it("took the tokens", async () => {
                expect(await this.token.balanceOf(holder)).to.be.a.bignumber.that.is.zero

                // Instead of burning the tokens, we move them to the contract's address
                // this has the cool effect that people can decide to give their reward back
                // to others by sending their tokens to the said contract
                expect(await this.token.balanceOf(this.ubi.address)).to.be.a.bignumber.that.equal(new BN(1000))
            })
        })
    })
})
