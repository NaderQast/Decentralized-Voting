// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is Ownable {
    enum VoteState { NotStarted, Active, Ended }
    VoteState public voteState;
    
    uint public yesVotes;
    uint public noVotes;
    
    mapping(address => bool) public hasVoted;
    
    event VoteStarted();
    event VoteEnded();
    event Voted(address voter, bool choice);
    
    modifier onlyActiveVote() {
        require(voteState == VoteState.Active, "Voting is not active");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        voteState = VoteState.NotStarted;
    }
    
    function startVoting() external onlyOwner {
        require(voteState == VoteState.NotStarted, "Voting already started/ended");
        voteState = VoteState.Active;
        emit VoteStarted();
    }
    
    function endVoting() external onlyOwner {
        require(voteState == VoteState.Active, "Voting is not active");
        voteState = VoteState.Ended;
        emit VoteEnded();
    }
    
    function vote(bool choice) external onlyActiveVote {
        require(!hasVoted[msg.sender], "Already voted");
        
        hasVoted[msg.sender] = true;
        
        if (choice) {
            yesVotes++;
        } else {
            noVotes++;
        }
        
        emit Voted(msg.sender, choice);
    }
    
    function getResults() external view returns (uint, uint) {
        require(
            msg.sender == owner() || voteState == VoteState.Ended,
            "Not authorized to view results"
        );
        return (yesVotes, noVotes);
    }
}