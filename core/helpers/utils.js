// @dependencies
const system = require('./system') //native
const {bdPhoneOperators} = require('../datasets/bdPhoneOperators.js') // native

// @returns a random number by given length - Author: Istiaq Hasan
const numRand = (length) => {
    let result           = [];
    let characters       = '0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
   return result.join('');
}

// @returns a random string by given length - Author: Istiaq Hasan
const stringRand = (length) => {
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
   return result.join('');
}

// @makes a token to use for multiple synced databases for one system
const makeToken = (v) => {
    let engineFingerprint = 'SM_NS_MG';
    let engineHash = numRand(40) + stringRand(20) + numRand(10) + stringRand(10);
    let id = system.unixMS() + numRand(10) + stringRand(10);
    let token = 
        stringRand(10) + 
        numRand(4) +
        '_' + v.label + '_' +
        system.unixMS() +
        stringRand(4) +
        numRand(4) + '_' +
        engineFingerprint + '_' +
        engineHash + '_' +
        stringRand(6) +
        id
    return token ;
}

const searchInDataset = (dataset, keyToCheck) =>{
  for (index in dataset) {
      if(dataset[index].token === keyToCheck){
          return dataset[index];
      }
  } 
}

// @get phone operator
const phoneOperator = (v) => {
  for (let i = 0; i < bdPhoneOperators.length; i++) {
      operator = bdPhoneOperators[i];
      if (v.includes(operator.code)) {
          return {
              'match' : 'Yes',
              'code' : operator.code,
              'operator' : operator.operator
          }
      } else {
          return {
              'match' : 'No',
              'code' : null,
              'operator' : null
          }
      }
  }
}

const commonColumns = (v) => {
  let initiateStatus = {
    'recordId' : 1,
    'updatedAtUTC' : system.utcNow(),
    'updatedAtLocal' : system.localNow(),
    'updatedAtMS' : system.unixMS(),
    'updatedBy' : v.userToken,
    'updatedActivityToken' : v.activityToken,
    'updatedValue' : 'Active'
  };
  let initiateExistence = {
    'recordId' : 1,
    'updatedAtUTC' : system.utcNow(),
    'updatedAtLocal' : system.localNow(),
    'updatedAtMS' : system.unixMS(),
    'updatedBy' : v.userToken,
    'updatedActivityToken' : v.activityToken,
    'updatedValue' : 1
  };
  return {
      "status" : 'Active',
      "existence" : 1,
      "createdBy" : v.userToken,
      "activityToken" : v.activityToken,
      "updateHistory" : [],
      "statusHistory" : [initiateStatus],
      "existenceHistory" : [initiateExistence]
  }
}



exports.numRand = numRand;
exports.stringRand = stringRand;
exports.makeToken = makeToken;
exports.searchInDataset = searchInDataset;
exports.phoneOperator = phoneOperator;
exports.commonColumns = commonColumns;
