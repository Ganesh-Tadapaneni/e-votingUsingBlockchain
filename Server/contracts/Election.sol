// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract Electionn is Ownable {
    mapping(uint256 => Contender) public contenders;
    uint256 public contenderCount;
    bool public votingClosed;
    uint256 public winningContenderId;
    
    struct Contender {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public hasVoted; // Mapping to track whether an address has voted

    event Voted(uint256 indexed contenderId, address indexed voter);
    event VotingClosed(uint256 winningContenderId);

    constructor() {
        contenderCount = 0;
        votingClosed = false;
    }

    function addContender(string memory _name) external onlyOwner {
        require(!votingClosed, "Voting is closed");
        
        contenderCount++;
        contenders[contenderCount] = Contender(contenderCount, _name, 0);
    }

    function vote(uint256 _contenderId) external {
        require(!votingClosed, "Voting is closed");
        require(_contenderId > 0 && _contenderId <= contenderCount, "Invalid contender ID");
        require(!hasVoted[msg.sender], "You have already voted");
        
        contenders[_contenderId].voteCount++;
        hasVoted[msg.sender] = true;
        emit Voted(_contenderId, msg.sender);
    }

    function closeVoting() external onlyOwner {
        require(!votingClosed, "Voting is already closed");
        
        votingClosed = true;
        uint256 maxVotes = 0;
        for (uint256 i = 1; i <= contenderCount; i++) {
            if (contenders[i].voteCount > maxVotes) {
                maxVotes = contenders[i].voteCount;
                winningContenderId = contenders[i].id;
            }
        }
        emit VotingClosed(winningContenderId);
    }

    function getContenderVoteCount(uint256 _contenderId) external view returns (uint256) {
        require(_contenderId > 0 && _contenderId <= contenderCount, "Invalid contender ID");
        return contenders[_contenderId].voteCount;
    }

    function getAllContenders() external view returns (Contender[] memory) {
        Contender[] memory allContenders = new Contender[](contenderCount);
        for (uint256 i = 1; i <= contenderCount; i++) {
            allContenders[i - 1] = contenders[i];
        }
        return allContenders;
    }
}
