import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("Study commitment", async() =>{
    async function deploy(){
        const { viem } = await network.connect();
        const [owner, student] = await viem.getWalletClients();

        const study = await viem.deployContract("StudyCommitment",
            [owner.account.address],
            {client: {wallet: student} }
        );
        return {viem, study, owner, student};
    }

    it("should create a session with a ETH", async () =>{
        const { study, student } = await deploy();

        await study.write.createSession([1800n], {
            value: parseEther("0.01"),
            account: student.account
        });

        const session = await study.read.getSession([0n]);

        assert.equal(session.stakedAmount, parseEther("0.01"));
        assert.equal(session.currentStatus, 1); // 1 ini refer di enum index
        assert.equal(session.student.toLowerCase(), student.account.address.toLowerCase());
    });

    it("should reject if non creator tries to complete session", async() =>{
        const { study, student, owner } = await deploy();
        await study.write.createSession([1800n], {
            value: parseEther("0.01"),
            account:student.account});

        await assert.rejects(
            () => study.write.completeSession([0n], { account: owner.account} ),
            (err: any ) => {
                assert.ok(err.message.includes("Only creator can mark complete!"));
                return true;
            }
        )
    });
})