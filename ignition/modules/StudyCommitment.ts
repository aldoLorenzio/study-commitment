import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StudyCommitmentModule = buildModule("StudyCommitmentModule", (m) =>{
    const charityAddress = m.getParameter(
        "charityAddress",
        "0xFdDF7FD1e1dD246043b677032EfE18d418f62672" //wallet metamask untuk charity
    );

    const studyCommitment = m.contract("StudyCommitment", [charityAddress]);
    return { studyCommitment };
})

export default StudyCommitmentModule;