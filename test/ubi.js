const { balance, BN, constants, expect, expectEvent, send, shouldFail, time } = require('openzeppelin-test-helpers')
const Ubi = artifacts.require("Ubi.sol")
const UbiToken = artifacts.require("UbiToken.sol")

contract("ubi", ([owner, holder, nonHolder]) => {
    describe("Deployment", () => {
        it("deploys", async () => {
            this.token = await UbiToken.new()
            await this.token.mint(holder, 1000)

            this.startBlock = await time.latestBlock()
            this.ubi = await Ubi.new(this.token.address, this.startBlock + 20)
        })

        it("should start in contribution period", async () => {
            expect(await this.ubi.period()).to.be.a.bignumber.that.is.zero
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
            while ((await time.latestBlock()) < this.startBlock + 20) {
                await time.advanceBlock()
            }
        })

        it("refuse contributions after contribution period ended", async () => {
            await shouldFail.reverting(send.ether(holder, this.ubi.address, 1000))
        })
    })

    describe("Collection period", () => {
        it("switched to collection period", async () => {
            expect(await this.ubi.period()).to.be.a.bignumber.that.equals(1)
        })

        describe("Non token holder", () => {
            it("refuse call", async () => {
                await shouldFail.reverting.withMessage(this.ubi.collect({ from: nonHolder }), "Not a token holder")
            })
        })

        describe("Token holder", () => {
            it("calls collection function", async () => {
                this.balanceBefore = await balance.current(holder)
                await this.ubi.collect({ from: holder })
                this.balanceAfter = await balance.current(holder)
            })

            it("sent the ETH", async () => {
                expect(this.balanceAfter - this.balanceBefore).to.be.a.bignumber.that.is.not.zero

                // Holder has 100% shares
                expect(await balance.current(this.ubi.address)).to.be.a.bignumber.that.is.zero
            })

            it("burnt the tokens", async () => {
                expect(await this.token.balanceOf(holder)).to.be.a.bignumber.that.is.zero
            })
        })
    })
})
