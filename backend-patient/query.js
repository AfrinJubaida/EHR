'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let ccp;
let wallet;

async function initialize() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('patient');
        if (!identity) {
            console.log('An identity for the user "patient" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    } catch (error) {
        console.error(`Failed to evaluate or invoke transaction: ${error}`);
        process.exit(1);
    }
}

async function showAll() {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'patient', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('ehr');

        // evaluate the specified transaction.
        const result = await contract.evaluateTransaction('viewAllReports');
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`showAll: Failed to evaluate or invoke transaction: ${error}`);
        return error;
    }
}

async function viewReport(d_name, disease) {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'patient', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('ehr');

        // evaluate the specified transaction.
        const result = await contract.evaluateTransaction('viewReport', d_name, disease);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`viewReport: Failed to evaluate or invoke transaction: ${error}`);
        return error;
    }
}

async function addReport(d_name, disease, medicine, newowner) {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'patient', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('ehr');

        // evaluate the specified transaction.
        const result = await contract.submitTransaction('addReport', d_name, disease, medicine, newowner);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`addReport: Failed to evaluate or invoke transaction: ${error}`);
        return error;
    }
}

exports.initialize = initialize;
exports.showAll = showAll;
exports.viewReport = viewReport;
exports.addReport = addReport;
