/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

//const { FileSystemWallet, Gateway } = require('fabric-network');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// const ccpPath = path.resolve(__dirname, 'connection.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);
// let serverCert = fs.readFileSync(path.join(__dirname, '../../../crypto-config/peerOrganizations/org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem'));
// ccp.organizations.Org1.adminPrivateKey = {path: path.join(__dirname, '../../../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/8168350db2bf17eab8a4a6bc1ac0550fbf3de8597e31f0266c532fbf3f34c695_sk')};
// ccp.organizations.Org1.signedCert = {path: path.join(__dirname, '../../../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem')};
// ccp.orderers['orderer.example.com'].tlsCACerts = {
//     path: path.join(__dirname, '../../../crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt')
// };
// ccp.orderers['orderer.example.com'].grpcOptions = {
//     'ssl-target-name-override':'orderer.example.com'
// };
// ccp.peers['peer0.org1.example.com'].grpcOptions = {
//     'ssl-target-name-override':'peer0.org1.example.com',
//     pem: Buffer.from(serverCert).toString()
// };
// ccp.peers['peer0.org1.example.com'].tlsCaCerts = {
//     path: path.join(__dirname, '../../../crypto-config/peerOrganizations/org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem')
// };
// ccp.peers['peer1.org1.example.com'].grpcOptions = {
//     'ssl-target-name-override':'peer1.org1.example.com',
//     pem: Buffer.from(serverCert).toString()
// };
// ccp.peers['peer1.org1.example.com'].tlsCaCerts = {
//     path: path.join(__dirname, '../../../crypto-config/peerOrganizations/org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem')
// };


class FabricClient {

    constructor() {

    }

    async listUsers(){
        // const walletPath = path.resolve(__dirname, '..', '..', 'wallet');
        // const wallet = new FileSystemWallet(walletPath);
        console.log("Querying Wallet...")
        const walletPath = path.resolve(__dirname, '..', '..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        let users = await wallet.list();
        console.log("Done")
        return users;
    }

    async invoke(user, command, variables = []){
        
        // Create a new file system based wallet for managing identities.
        // const walletPath = path.resolve(__dirname, '..', '..', 'wallet');
        // const wallet = new FileSystemWallet(walletPath);
        const walletPath = path.resolve(__dirname, '..', '..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user);
        if (!identity) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        console.log('sending the command: '.concat(command));
        const result = await contract.submitTransaction(command, ...variables);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        return result.toString();
    }

    async query(user, command, variables = []) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', 'wallet');
        console.log(`aha Wallet path: ${walletPath}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user);
        if (!identity) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Submit the specified transaction.
        console.log(`Sending the ${command}`);
        const result = await contract.evaluateTransaction(command, ...variables);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        return JSON.parse(result.toString());

    }
}

module.exports = FabricClient;
