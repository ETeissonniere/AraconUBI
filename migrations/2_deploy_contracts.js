var Ubi = artifacts.require("Ubi.sol")
var UbiToken = artifacts.require("UbiToken.sol")

// Change me as needed
const endingBlock = 4242424242

module.exports = (deployer) => {
    return deployer.deploy(UbiToken)
        .then(() => {
            return deployer.deploy(Ubi, UbiToken.address, endingBlock)
        })
}
