import { CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { CeloContract } from "@celo/contractkit";
import {
  deployerAddress,
  deployerKey,
  factoryBytecode,
} from "@ubeswap/solidity-create2-deployer";
import { ActionType } from "hardhat/types";

export const deployCreate2: ActionType<{}> = async (_, hre) => {
  const [deployer] = hre.celo.getSigners();
  if (!deployer) {
    throw new Error("Deployer not found.");
  }

  // send $1 to funding addr
  const cUSD = await hre.celo.kit.contracts.getStableToken();
  await cUSD.transfer(deployerAddress, "100000000000000000").send({
    from: await deployer.getAddress(),
    gas: 5000000,
    gasPrice: 0.5 * 10 ** 9,
    feeCurrency: CeloContract.StableToken,
  });

  // deploy create2 factory
  const provider = hre.celo.ethersProvider;
  const wallet = new CeloWallet(deployerKey, provider);
  const tx = await (
    await wallet.sendTransaction({
      from: deployerAddress,
      data: factoryBytecode,
      gasLimit: 9000000,
      gasPrice: 10 ** 9,
      feeCurrency: cUSD.address,
    })
  ).wait();
  console.log("Create2 deployer factory:", tx);
};
