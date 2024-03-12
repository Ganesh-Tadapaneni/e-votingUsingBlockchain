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

contract Election is Ownable {
    mapping(uint256 => Contender) public contenders;
    uint256 public contenderCount;
    bool public votingClosed;
    bool public registrationsOpen; // Variable to control registration status
    uint256 public winningContenderId;
    
    struct Contender {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public hasVoted; // Mapping to track whether an address has voted
    mapping(address => bool) public isRegistered; // Mapping to track whether an address is registered for voting

    event Voted(uint256 indexed contenderId, address indexed voter);
    event VotingClosed(uint256 winningContenderId);
    event RegistrationOpened();
    event RegistrationClosed();

    constructor() {
        contenderCount = 0;
        votingClosed = true;
        registrationsOpen = true; // Registration is open by default
    }

    modifier onlyWhenRegistrationsOpen() {
        require(registrationsOpen, "Registrations are closed");
        _;
    }

    modifier onlyWhenVotingOpen() {
        require(!votingClosed, "Voting is closed");
        _;
    }

    function openRegistrations() external onlyOwner {
        votingClosed = true;
        registrationsOpen = true;
        emit RegistrationOpened();
    }

    function closeRegistrations() external onlyOwner {
        registrationsOpen = false;
        
        emit RegistrationClosed();
    }

    function openVoting() external onlyOwner {
        votingClosed = false;
    }

    function addContender(string memory _name) external onlyOwner onlyWhenVotingOpen {
        contenderCount++;
        contenders[contenderCount] = Contender(contenderCount, _name, 0);
    }

    function registerForVoting() external onlyWhenRegistrationsOpen {
        require(!isRegistered[msg.sender], "You are already registered for voting");
        isRegistered[msg.sender] = true;
    }

    function vote(uint256 _contenderId) external onlyWhenVotingOpen {
        require(isRegistered[msg.sender], "You are not registered for voting");
        require(_contenderId > 0 && _contenderId <= contenderCount, "Invalid contender ID");
        require(!hasVoted[msg.sender], "You have already voted");
        
        contenders[_contenderId].voteCount++;
        hasVoted[msg.sender] = true;
        emit Voted(_contenderId, msg.sender);
    }

    function closeVoting() external onlyOwner onlyWhenVotingOpen {
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
