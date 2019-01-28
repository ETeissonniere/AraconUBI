contract("ubi", accounts => {
    describe("Deployment", () => {
        it("should start in contribution period")
    })

    describe("Contribution period", () => {
        it("accepts receiving ETH")
        it("refuse calling collection function")
        it("advance time")
        it("refuse contributions after contribution period ended")
    })

    describe("Collection period", () => {
        describe("Non token holder", () => {
            it("refuse call")
        })

        describe("Token holder", () => {
            it("calls collection function")
            it("sent the ETH")
            it("burnt the tokens")
        })
    })
})
