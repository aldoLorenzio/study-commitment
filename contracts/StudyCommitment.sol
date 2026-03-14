// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract StudyCommitment{
    enum Status { Inactive, Active, Completed, Failed}

    struct Challenge{
        address student;
        uint256 stakedAmount;
        uint256 startTime;
        uint256 deadline;
        Status currentStatus;
    }

    mapping(uint256 => Challenge) public challenges;
    uint256 public challengeCount;
    address public owner;
    address public charityAddress;

    constructor(address _charityAddress){
        owner = msg.sender;
        charityAddress = _charityAddress;
    }

    event SessionStarted(address indexed student, uint256 deadline, uint256 stakedAmount);
    event SessionCompleted(address indexed student, uint256 stakedAmount);
    event SessionFailed(address _charityAddress, uint256 stakedAmount);

    function createSession(uint256 _duration) external payable {
        Challenge storage challenge = challenges[challengeCount];
        require(msg.value > 0, "Must stake some ETH");
        require(challenge.currentStatus != Status.Active, "Already in a session");

        challenge.student = msg.sender;
        challenge.stakedAmount = msg.value;
        challenge.startTime = block.timestamp;
        challenge.deadline = block.timestamp + _duration;
        challenge.currentStatus = Status.Active;

        challengeCount++;
        emit SessionStarted(msg.sender, block.timestamp + _duration, msg.value);
    }

    function completeSession(uint256 _challengeId) external{
        Challenge storage challenge = challenges[_challengeId];

        require(msg.sender == challenge.student, "Only creator can mark complete!");
        require(challenge.currentStatus == Status.Active, "Status session must be active!");
        require(block.timestamp < challenge.deadline, "Deadline already been passed");

        challenge.currentStatus = Status.Completed;
        (bool success, ) = payable(challenge.student).call{value: challenge.stakedAmount}("");
        require(success, "Transfer failed");

        emit SessionCompleted(challenge.student, challenge.stakedAmount);
    }

    function failSession(uint256 _challengeId) external{
        Challenge storage challenge = challenges[_challengeId];

        require(msg.sender == challenge.student, "Only creator can mark complete!");
        require(challenge.currentStatus == Status.Active, "Status session must be active!");
        require(block.timestamp > challenge.deadline,"Deadline not passed yet!");

        challenge.currentStatus = Status.Failed;
        (bool success, ) = payable(charityAddress).call{value: challenge.stakedAmount}("");
        require(success, "Transfer failed");

        emit SessionFailed(charityAddress, challenge.stakedAmount);
    }

    function getSession(uint256 _challengeId) external view returns (Challenge memory){
        return challenges[_challengeId];
    }

}