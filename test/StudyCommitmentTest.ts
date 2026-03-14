import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("Study commitment", async() =>{
    async function deploy(){
        const { viem } = await network.connect();
        const [deployer, randomAccount, charityAccount] = await viem.getWalletClients();

        const study = await viem.deployContract("StudyCommitment",
            [charityAccount.account.address],
            {client: {wallet: deployer} }
        );
        return {viem, study, deployer, randomAccount, charityAccount};
    }

    it("should create a session with a ETH", async () =>{
        const { study, deployer } = await deploy();

        await study.write.createSession([1800n], {
            value: parseEther("0.01"),
            account: deployer.account
        });

        const session = await study.read.getSession([0n]);

        assert.equal(session.stakedAmount, parseEther("0.01"));
        assert.equal(session.currentStatus, 1); // 1 ini refer di enum index
        assert.equal(session.student.toLowerCase(), deployer.account.address.toLowerCase());
    });

    it("should reject if non creator tries to complete session", async() =>{
        const { study, deployer, randomAccount } = await deploy();
        await study.write.createSession([1800n], {
            value: parseEther("0.01"),
            account:deployer.account
        });

        await assert.rejects(
            () => study.write.completeSession([0n], { account: randomAccount.account} ),
            (err: any ) => {
                assert.ok(err.message.includes("Only creator can mark complete!"));
                return true;
            }
        )
    });

    it("should reject session with 0 ETH", async() =>{
        const { study, deployer } = await deploy();

        await assert.rejects(
            () => study.write.createSession([1800n], {
            value: parseEther("0"),
            account:deployer.account
        }),
        (err: any) =>{
            assert.ok(err.message.includes("Must stake some ETH"));
            return true;
        })
    });

        it("should return ETH to student when session completed and change ", async() =>{
        const { viem, study, deployer } = await deploy();

        const publicClient = await viem.getPublicClient();
        const balanceBefore = await publicClient.getBalance({
            address: deployer.account.address
        });

        await study.write.createSession([1800n],{
            value: parseEther("0.01"),
            account: deployer.account
        });

        await study.write.completeSession([0n],{
            account: deployer.account
        });

        const balanceAfter = await publicClient.getBalance({
            address: deployer.account.address
        });
        const session = await study.read.getSession([0n]);

        const diff = balanceBefore - balanceAfter;
        assert.ok(diff < parseEther("0.01"),"ETH not returned to student")
        assert.equal(session.currentStatus, 2); // 2 ini enum completed di contract
    });
})