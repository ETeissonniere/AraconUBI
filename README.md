# Aracon UBI

A cool opt-in UBI proof of concept for Aracon 2019.


## Flow

The contract flow is splitted in two periods:
- contribution
- collection


### Contribution period

Anyone can give ETH to the contract to be collected later by token holders.

People making money from Aracon are encouraged to contribute.

> Other functions are disabled


### Collection period

- We don't accept ETH anymore (though we have to consider the fact that the contract may still receive some, for example via `selfdestruct` calls)
- Token holders can claim a percentage of the contract's balance


1. Token holder calls contract
2. We compute the share as `toSend = this.balance / (tokenSupply / tokenBalance)` which equals to `toSend = (this.balance * tokenBalance) / tokenSupply`
3. We `burn` the tokens of the holder, tokens vanishes!
4. We send him its reward
