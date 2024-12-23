import { expect } from "chai";
import { ethers } from "hardhat";
import { FreelancePlatform } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("FreelancePlatform", () => {
    let freelancePlatform: FreelancePlatform;
    let admin: SignerWithAddress;
    let client: SignerWithAddress;
    let freelancer: SignerWithAddress;

    before(async () => {
        [admin, client, freelancer] = await ethers.getSigners();
    });

    beforeEach(async () => {
        const FreelancePlatformFactory = await ethers.getContractFactory("FreelancePlatform");
        freelancePlatform = (await FreelancePlatformFactory.deploy()) as FreelancePlatform;
    });

    describe("Job Management", () => {
        it("Should allow a client to create a job", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            const job = await freelancePlatform.jobs(jobId);

            expect(job.id).to.equal(jobId);
            expect(job.client).to.equal(client.address);
            expect(job.amount).to.equal(jobAmount);
            expect(job.isCompleted).to.be.false;
        });

        it("Should prevent creating a job with insufficient funds", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");
            const insufficientAmount = ethers.parseEther("0.5");

            await expect(
                freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: insufficientAmount }),
            ).to.be.revertedWith("Amount mismatch");
        });

        it("Should prevent creating a duplicate job ID", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });

            await expect(
                freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount }),
            ).to.be.revertedWith("Job ID already exists");
        });

        it("Should allow a client to accept a freelancer for a job", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);
            const job = await freelancePlatform.jobs(jobId);

            expect(job.freelancer).to.equal(freelancer.address);
        });

        it("Should prevent non-client from accepting freelancer", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });

            await expect(freelancePlatform.connect(freelancer).acceptJob(jobId, freelancer.address)).to.be.revertedWith(
                "Not the client",
            );
        });

        it("Should allow the client to complete a job", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");
            const platformFee = await freelancePlatform.platformFee();
            const feeAmount = (jobAmount * BigInt(platformFee)) / 100n;
            const payoutAmount = jobAmount - feeAmount;

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);

            const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);
            const ownerBalanceBefore = await ethers.provider.getBalance(admin.address);

            await freelancePlatform.connect(client).completeJob(jobId);

            const job = await freelancePlatform.jobs(jobId);
            const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);
            const ownerBalanceAfter = await ethers.provider.getBalance(admin.address);

            expect(job.isCompleted).to.be.true;
            expect(freelancerBalanceAfter - freelancerBalanceBefore).to.equal(payoutAmount);
            expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(feeAmount);
        });

        it("Should prevent completing an already completed job", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);
            await freelancePlatform.connect(client).completeJob(jobId);

            await expect(freelancePlatform.connect(client).completeJob(jobId)).to.be.revertedWith(
                "Job already completed",
            );
        });
    });

    describe("Dispute Management", () => {
        it("Should allow both client and freelancer to dispute a job", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);

            // Client disputes
            await freelancePlatform.connect(client).disputeJob(jobId);
            let job = await freelancePlatform.jobs(jobId);
            expect(job.isDisputed).to.be.true;

            // Resolve and create new job for freelancer dispute test
            await freelancePlatform.connect(admin).resolveDispute(jobId, false);

            // Freelancer disputes
            const newJobId = 2;
            await freelancePlatform.connect(client).createJob(newJobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(newJobId, freelancer.address);

            await freelancePlatform.connect(freelancer).disputeJob(newJobId);
            job = await freelancePlatform.jobs(newJobId);
            expect(job.isDisputed).to.be.true;
        });

        it("Should prevent disputing a completed job", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);
            await freelancePlatform.connect(client).completeJob(jobId);

            await expect(freelancePlatform.connect(client).disputeJob(jobId)).to.be.revertedWith(
                "Job already completed",
            );
        });

        it("Should allow the platform owner to resolve disputes", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);
            await freelancePlatform.connect(client).disputeJob(jobId);

            const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);

            // Resolve in favor of freelancer
            await freelancePlatform.connect(admin).resolveDispute(jobId, true);

            const job = await freelancePlatform.jobs(jobId);
            const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);

            expect(job.isCompleted).to.be.true;
            expect(job.isDisputed).to.be.false;
            expect(freelancerBalanceAfter - freelancerBalanceBefore).to.equal(jobAmount);
        });

        it("Should prevent non-owner from resolving disputes", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);
            await freelancePlatform.connect(client).disputeJob(jobId);

            await expect(freelancePlatform.connect(client).resolveDispute(jobId, false)).to.be.revertedWith(
                "Not the platform owner",
            );
        });

        it("Should prevent resolving non-disputed jobs", async () => {
            const jobId = 1;
            const jobAmount = ethers.parseEther("1");

            await freelancePlatform.connect(client).createJob(jobId, jobAmount, { value: jobAmount });
            await freelancePlatform.connect(client).acceptJob(jobId, freelancer.address);

            await expect(freelancePlatform.connect(admin).resolveDispute(jobId, false)).to.be.revertedWith(
                "Job not disputed",
            );
        });
    });
});
