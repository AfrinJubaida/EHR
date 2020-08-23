'use strict';

// Fabric smart contract class
const { Contract } = require('fabric-contract-api');

// The Product model
const Report = require('./report.js');

/**
 * The e-store smart contract
 */
class ehrContract extends Contract {

    /**
     * Initialize the ledger with a few products to start with.
     * @param {Context} ctx the transaction context.
     */
    async initLedger(ctx) {
        const reports = [
            {
                d_name: 'alex',
                disease: 'fever',
                medicine: 'NapaExtra',
                
                owner: 'alex',
                allowed: false
            },
            {
                d_name: 'anisha',
                disease: 'cough',
                medicine: 'Fexo',
                
                owner: 'anisha',
                allowed: false
            },
            {
                d_name: 'rijita',
                disease: 'headache',
                medicine: 'Ace-plus',
                
                owner: 'rijita',
                allowed: true
            }
        ];

        for (let i = 0; i < reports.length; i++) {
            await this.releaseReport(ctx, reports[i].d_name, reports[i].disease, reports[i].medicine, 
                 reports[i].owner, reports[i].allowed);
        }

        return reports;
    }

    /**
     * Release a new product into the store.
     * @param {Context} ctx The transaction context
     * @param {String} vendor The vendor for this product.
     * @param {String} name The name of this product.
     * @param {String} price The product price
     * @param {String} owner The owner of the product. If unbought, this field should be the same as the vendor.
     * @param {Boolean} bought Whether this product has been bought yet.
     */
    async releaseReport(ctx, d_name, disease, medicine, owner, allowed) {
        // Create a composite key 'PROD{vendor}{name}' for this product.
        let key = ctx.stub.createCompositeKey('PROD', [d_name, disease]);
        // Create a new product object with the input data.
        const report = new Report(d_name, disease, medicine, owner, allowed);

        // Save the product in the datastore.
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(report)));

        return report;
    }

    /**
     * Buy a product from the store. The product must exist in the store first
     * and be unbought.
     * @param {String} ctx The transaction context.
     * @param {String} vendor The product vendor.
     * @param {String} name The product name.
     * @param {String} newOwner The new owner for the product.
     */
    async addReport(ctx, d_name, disease, medicine, newowner) {
        // Retrieve the product from the store based on its vendor and name.
        const key = ctx.stub.createCompositeKey('PROD', [d_name, disease]);
        const reportAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!reportAsBytes || reportAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const report = Report.deserialize(JSON.parse(reportAsBytes.toString()));

        // Check whether the product has already been bought.
        if (report.getIsAllowed()) {
            throw new Error(`${key} is not available for show`);
        }

        // Update the product in the data store.
        report.setowner(newowner);
        report.setIsAllowed();
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(report)));

        return report;
    }

    /**
     * Retrieve information about a product.
     * @param {String} ctx The transaction context.
     * @param {String} vendor The product vendor.
     * @param {String} name The product name.
     */
    async viewReport(ctx, d_name, medicine) {
        // Retrieve the product document from the data store based on its vendor and name.
        const key = ctx.stub.createCompositeKey('PROD', [d_name, medicine]);
        const reportAsBytes = await ctx.stub.getState(key);
        
        // Check whether the product exists.
        if (!reportAsBytes || reportAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Return the product information.
        return reportAsBytes.toString();
    }

    /**
     * View all unsold products in the store.
     * @param {String} ctx The transaction context.
     */
    async viewAllReports(ctx) {
        // Retrieve all products stored in the data store.
        const results = [];
        for await (const result of ctx.stub.getStateByPartialCompositeKey('PROD', [])) {
            const strValue = Buffer.from(result.value).toString('utf8');            
            try {
                let report = Report.deserialize(JSON.parse(strValue));

                // Only include those products that haven't been bought yet.
                if (!report.getIsAllowed()) {
                    results.push(report);
                }
            } catch (error) {
                throw error;
            }
        }

        return results;
    }
}

module.exports = ehrContract;
