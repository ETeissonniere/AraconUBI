pragma solidity ^0.5.0;

import "./UbiToken.sol";

contract Ubi {
    enum Period {
        CONTRIBUTION,
        COLLECTION
    }

    uint public endCollectionPeriod;
    Period public period;

    UbiToken public token;

    constructor(UbiToken ubiToken, uint endOfCollectionPeriod) public {
        token = ubiToken;
        endCollectionPeriod = endOfCollectionPeriod;
    }
}
