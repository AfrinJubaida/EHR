'use strict';

/**
 * The Product model.
 */
class Report {
    constructor(d_name, disease, medicine, owner, allowed) {
        this.d_name = d_name;
        this.disease = disease;
        this.medicine = medicine;
        
        this.owner = owner;
        
        // parse the boolean value from a string.
        if (allowed === 'true' || allowed === true) {
            this.allowed = true;
        } else {
            this.allowed = false;
        }
    }
    getMedicine(){
        return this.medicine;
    }
    setMedicine(medicine) {
        this.medicine = medicine;
    }

    

    getOwner() {
        return this.owner;
    }

    setowner(newowner) {
        this.owner = newowner;
    }

    getIsAllowed() {
        return this.allowed;
    }

    setIsAllowed() {
        this.allowed = true;
    }

    static deserialize(data) {
        return new Report(data.d_name, data.disease, data.medicine, data.owner, data.allowed);
    }
}

module.exports = Report;
