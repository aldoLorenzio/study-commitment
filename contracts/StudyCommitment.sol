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

}