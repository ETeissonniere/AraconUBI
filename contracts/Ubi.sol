pragma solidity ^0.5.0;

import "./UbiToken.sol";

contract Ubi {
    enum Period {
        CONTRIBUTION,
        COLLECTION
    }

    uint public endCollectionPeriod;

    UbiToken public token;

    event ReceivedContribution(address from, uint256 amount);

    modifier onlyInCollectionPeriod {
        require(period() == Period.COLLECTION, "Bad period");
        _;
    }

    modifier onlyInContributionPeriod {
        require(period() == Period.CONTRIBUTION, "Bad period");
        _;
    }

    constructor(UbiToken ubiToken, uint endOfCollectionPeriod) public {
        token = ubiToken;
        endCollectionPeriod = endOfCollectionPeriod;
    }

    function () payable onlyInContributionPeriod external {
        emit ReceivedContribution(msg.sender, msg.value);
    }

    function collect() onlyInCollectionPeriod public {
    }

    function period() view public returns (Period) {
        if (block.number >= endCollectionPeriod) {
            return Period.COLLECTION;
        }

        return Period.CONTRIBUTION;
    }
}
