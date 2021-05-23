const express = require('express'); // module
const router = express.Router(); // module
const multer = require('multer'); // module
const native = require('../helpers/native'); // native
const utils = require('../helpers/utils'); // native
const system = require('../helpers/system'); // native
const AppTempCart = require('../models/app/TempCart'); // mongoose model
const AppTempCartDetails = require('../models/app/TempCartDetails'); // mongoose model
const AppUserCart = require('../models/app/UserCart'); // mongoose model
const AppUserCartDetails = require('../models/app/UserCartDetails'); // mongoose model


router.post('/item/new', async (req, res) => {
    let unique = "Cart::AddToCart";
    let proceed = true;
    req.nativeRequest.endpoint = 'cart/item/new';

    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
        let tempCartToken = utils.makeToken({label: 'AppTCT'});
        let tempCartDetailsToken = utils.makeToken({label: 'AppTCDT'});
        let dataToSaveAtTempCart = {
            'token' : tempCartToken,
            'deviceToken' : req.nativeRequest.deviceToken
        };

        let dataToSaveAtTempCartDetails = {
          'token' : tempCartDetailsToken,
          'tempCartToken': tempCartToken,
          'deviceToken' : req.nativeRequest.deviceToken,
          'productToken' : req.body.productToken,
          'units' : req.body.units
        };

        dataToSaveAtTempCart = Object.assign({}, dataToSaveAtTempCart, utils.commonColumns(req.nativeRequest));
        dataToSaveAtTempCartDetails = Object.assign({}, dataToSaveAtTempCartDetails, utils.commonColumns(req.nativeRequest));

        let tempCartNewRecord = new AppTempCart(dataToSaveAtTempCart);
        let tempCartDetailsNewRecord = new AppTempCartDetails(dataToSaveAtTempCartDetails);
        try {
          tempCartSaveNewRecord = await tempCartNewRecord.save();
          tempCartDetailsSaveNewRecord = await tempCartDetailsNewRecord.save();

          if(tempCartSaveNewRecord && tempCartDetailsSaveNewRecord){
              // @send response
              native.response({
                  'responseCode' : 'INSERTION_SUCCESSFUL',
                  'errorLog' : {},
                  'data' : {
                      'item' : {
                        'tempCart': tempCartSaveNewRecord,
                        'tempCartDetails': tempCartDetailsSaveNewRecord
                      },
                      'count' : 2
                  }
              }, req, res);
          }
          else{
              // @send error response
              native.response({
                  'responseCode' : 'TRY_AGAIN',
                  'errorLog' : {
                      'location' : unique,
                      'query' : 'Add To Cart',
                      'details' : `Query ERROR`
                  },
                  'data' : {}
              }, req, res);
          }
        } 
        catch (error) {
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : 'Add To Cart',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
})


router.get('/details/:token', async (req, res) => {
    let unique = "Cart::CartDetails";
    let proceed = true;
    req.nativeRequest.endpoint = 'cart/details/:token';
    if(proceed === true){
        let conditions = {
            'tempCartToken' : req.params.token,
            'status' : 'Active',
            'existence' : 1
        }
        try {
            let singleRecord = await AppTempCartDetails.find(conditions);

            if (singleRecord.length == 1) {
                // @send success response
                native.response({
                    'responseCode' : 'LIST_LOADED',
                    'errorLog' : {},
                    'data' : {
                        'item' : singleRecord[0],
                        'count' : 1
                    }
                }, req, res);
            } 
            else {
                // @send error response
                native.response({
                    'responseCode' : 'TRY_AGAIN',
                    'errorLog' : {
                        'location' : unique,
                        'query' : 'SELECT SINGLE PRODUCT',
                        'details' : `Result Length Error`
                    },
                    'data' : {}
                }, req, res);
            }
        } 
        catch (error) {
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : 'SELECT SINGLE PRODUCT',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
    
});








module.exports = router;