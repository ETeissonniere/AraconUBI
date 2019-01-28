pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract UbiToken is ERC20, ERC20Mintable, ERC20Detailed {
    constructor()
        ERC20Mintable()
        ERC20Detailed("Aracon UBI POC", "AUBI", 18)
        ERC20()
        public
    {}
}
