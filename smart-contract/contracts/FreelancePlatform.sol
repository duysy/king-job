// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelancePlatform {
    struct Job {
        uint id;
        address client;
        address freelancer;
        uint amount;
        bool isCompleted;
        bool isDisputed;
    }

    mapping(uint => Job) public jobs;
    address public platformOwner;
    uint public platformFee = 2; // 2% fee

    event JobCreated(uint indexed jobId, address indexed client, uint amount);
    event JobAccepted(uint indexed jobId, address indexed freelancer);
    event JobCompleted(uint indexed jobId, address indexed freelancer, uint amount);
    event JobDisputed(uint indexed jobId, address indexed initiator);

    modifier onlyClient(uint jobId) {
        require(jobs[jobId].client == msg.sender, "Not the client");
        _;
    }

    modifier onlyFreelancer(uint jobId) {
        require(jobs[jobId].freelancer == msg.sender, "Not the freelancer");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == platformOwner, "Not the platform owner");
        _;
    }

    constructor() {
        platformOwner = msg.sender;
    }

    function createJob(uint jobId, uint _amount) external payable {
        require(msg.value == _amount, "Amount mismatch");
        require(jobs[jobId].id == 0, "Job ID already exists");

        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: _amount,
            isCompleted: false,
            isDisputed: false
        });

        emit JobCreated(jobId, msg.sender, _amount);
    }

    function acceptJob(uint jobId, address freelancer) external onlyClient(jobId) {
        Job storage job = jobs[jobId];
        require(job.id != 0, "Job does not exist");
        require(job.freelancer == address(0), "Job already accepted");

        job.freelancer = freelancer;

        emit JobAccepted(jobId, freelancer);
    }

    function completeJob(uint jobId) external onlyClient(jobId) {
        Job storage job = jobs[jobId];
        require(job.freelancer != address(0), "No freelancer assigned");
        require(!job.isCompleted, "Job already completed");

        uint fee = (job.amount * platformFee) / 100;
        uint payout = job.amount - fee;

        job.isCompleted = true;
        payable(job.freelancer).transfer(payout);
        payable(platformOwner).transfer(fee);

        emit JobCompleted(jobId, job.freelancer, payout);
    }

    function disputeJob(uint jobId) external {
        Job storage job = jobs[jobId];
        require(!job.isCompleted, "Job already completed");
        require(jobs[jobId].client == msg.sender || jobs[jobId].freelancer == msg.sender, "Not authorized to dispute");

        job.isDisputed = true;

        emit JobDisputed(jobId, msg.sender);
    }

    function resolveDispute(uint jobId, bool favorFreelancer) external onlyOwner {
        Job storage job = jobs[jobId];
        require(job.isDisputed, "Job not disputed");

        if (favorFreelancer) {
            payable(job.freelancer).transfer(job.amount);
        } else {
            payable(job.client).transfer(job.amount);
        }

        job.isCompleted = true;
        job.isDisputed = false;
    }

    function setPlatformFee(uint _fee) external onlyOwner {
        platformFee = _fee;
    }
}
