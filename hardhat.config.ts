import "@ubeswap/hardhat-celo";
import { fornoURLs, ICeloNetwork } from "@ubeswap/hardhat-celo";
import "dotenv/config";
import "hardhat-abi-exporter";
import "hardhat-spdx-license-identifier";
import { HardhatUserConfig, task } from "hardhat/config";
import { HDAccountsUserConfig } from "hardhat/types";

task("deploy-create2", "Deploys the CREATE2 deployer.", async (...args) => {
  return (await import("./tasks/deploy-create2").then((f) => f.deployCreate2))(
    // @ts-ignore
    ...args
  );
});
task("deploy-multicall", "Deploys Multicall.", async (...args) => {
  return (
    await import("./tasks/deploy-multicall").then((f) => f.deployMulticall)
  )(
    // @ts-ignore
    ...args
  );
});

const accounts: HDAccountsUserConfig = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
  path: "m/44'/52752'/0'/0/",
};

export default {
  abiExporter: {
    path: "./build/abi",
    flat: true,
  },
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
      url: fornoURLs[ICeloNetwork.MAINNET],
      accounts,
      chainId: ICeloNetwork.MAINNET,
      live: true,
      gasPrice: 0.5 * 10 ** 9,
      gas: 8000000,
    },
    alfajores: {
      url: fornoURLs[ICeloNetwork.ALFAJORES],
      accounts,
      chainId: ICeloNetwork.ALFAJORES,
      live: true,
      gasPrice: 0.5 * 10 ** 9,
      gas: 8000000,
    },
    baklava: {
      url: fornoURLs[ICeloNetwork.BAKLAVA],
      accounts,
      chainId: ICeloNetwork.BAKLAVA,
      live: true,
      gasPrice: 0.5 * 10 ** 9,
      gas: 8000000,
    },
  },
  paths: {
    deploy: "scripts/deploy",
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
      },
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "metadata",
          ],
          "": ["ast"],
        },
      },
    },
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
} as HardhatUserConfig;
