import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-docgen";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "hardhat-log-remover";

dotenv.config();

const accounts = [process.env.PRIVATE_KEY || ""];

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: { count: 100 },
        },
        opbnb: {
            url: "https://opbnb-mainnet-rpc.bnbchain.org",
            accounts: accounts,
            chainId: 204,
            gasPrice: 20000000000,
        },
        opbnb_testnet: {
            url: "https://opbnb-testnet-rpc.bnbchain.org",
            accounts: accounts,
            chainId: 5611,
            gasPrice: 20000000000,
        },
    },
    etherscan: {
        apiKey: {
            opbnb: process.env.BSCSCAN_API_KEY || "",
            opbnb_testnet: process.env.BSCSCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "opbnb",
                chainId: 204,
                urls: {
                    apiURL: "https://api-opbnb.bscscan.com/api",
                    browserURL: "https://opbnb.bscscan.com",
                },
            },
            {
                network: "opbnb_testnet",
                chainId: 5611,
                urls: {
                    apiURL: `https://open-platform.nodereal.io/${process.env.YOUR_NODEREAL_API_KEY}/op-bnb-testnet/contract/`,
                    browserURL: "https://testnet.opbnbscan.com",
                },
            },
        ],
    },
    solidity: {
        compilers: [
            {
                version: "0.8.18",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    viaIR: true,
                    evmVersion: "london",
                },
            },
        ],
    },
    paths: {
        sources: "./contracts",
        tests: "./tests",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 200000,
        reporter: "mocha-multi-reporters",
        reporterOptions: {
            configFile: "./mocha-report.json",
        },
    },
    docgen: {
        path: "./docs",
        clear: true,
        runOnCompile: false,
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    gasReporter: {
        currency: "USD",
        gasPrice: 1,
        enabled: process.env.REPORT_GAS ? true : false,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        token: "BNB",
        gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice",
        excludeContracts: [],
        src: "./contracts",
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v6",
    },
};

export default config;
