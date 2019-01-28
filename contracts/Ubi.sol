pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "./UbiToken.sol";

contract Ubi {
    enum Period {
        CONTRIBUTION,
        COLLECTION
    }

    uint public endCollectionPeriod;

    UbiToken public token;
    using SafeERC20 for UbiToken;

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
        uint256 callerBalance = token.balanceOf(msg.sender);
        require(token.balanceOf(msg.sender) > 0, "Not a token holder");

        uint256 tokensToShare = token.totalSupply() - token.balanceOf(address(this));
        uint256 amountToReward = 
            (address(this).balance * callerBalance) /
            tokensToShare;

        token.safeTransferFrom(msg.sender, address(this), callerBalance);

        msg.sender.transfer(amountToReward);
    }

    function period() view public returns (Period) {
        if (block.number >= endCollectionPeriod) {
            return Period.COLLECTION;
        }

        return Period.CONTRIBUTION;
    }
}
