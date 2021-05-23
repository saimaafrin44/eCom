const express = require('express'); // module
const router = express.Router(); // module
const multer = require('multer'); // module
const fileUpload = require('../helpers/fileUpload'); // native
const native = require('../helpers/native'); // native
const utils = require('../helpers/utils'); // native
const system = require('../helpers/system'); // native
const AppProduct = require('../models/app/Product'); // mongoose model
const AppCategory = require('../models/app/Category'); // mongoose model
const AppCategoryAndProduct = require('../models/app/CategoryAndProduct'); // mongoose model


router.get('/', async (req, res) => {
    let unique = "ProductRoot";
    let proceed = true;
    req.nativeRequest.endpoint = 'product';
    native.response({
        'responseCode' : 'YOU_ARE_LOST',
        'errorLog' : {
            'location' : unique,
            'code' : '404'
        },
        'data' : {}
    }, req, res)
});

router.post('/new', multer({ storage: fileUpload.fileStorage('products'), fileFilter: fileUpload.fileFilter }).single('productImage'), async (req, res) => {
    let unique = "Product::NewProduct";
    let proceed = true;
    req.nativeRequest.endpoint = 'product/new';

    // Error Handling - Upload Image
    let file = req.file
    if (!file) {
      let error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next("hey error")
    }


    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
        let tempImages = {
            'desktop' : req.token + '_desktop' + req.imageExtension,
            'mobile' :  req.token + '_mobile' + req.imageExtension
        }

        let dataToSave = {
            'token' : req.token,
            'title' : req.body.title,
            'slug' : req.body.slug,
            'sku' : req.body.sku,
            'shortDetails' : req.body.shortDetails,
            'details' : req.body.details,
            'images' : tempImages,
            'regularPrice' : req.body.regularPrice,
            'discountedPrice' : req.body.discountedPrice,
            'countablePrice' : req.body.countablePrice,
            'eatable' : req.body.eatable,
            'nutritionalValues' : {'totalCalories' : req.body.calories},
            'origin' : req.body.origin
        };

        dataToSave = Object.assign({}, dataToSave, utils.commonColumns(req.nativeRequest));
        let newRecord = new AppProduct(dataToSave);
        try {
            saveNewRecord = await newRecord.save();
            if(saveNewRecord){
                // @send response
                native.response({
                    'responseCode' : 'INSERTION_SUCCESSFUL',
                    'errorLog' : {},
                    'data' : {
                        'item' : saveNewRecord,
                        'count' : 1
                    }
                }, req, res);
            }
            else{
                // @send error response
                native.response({
                    'responseCode' : 'TRY_AGAIN',
                    'errorLog' : {
                        'location' : unique,
                        'query' : 'CREATE NEW PRODUCT',
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
                    'query' : 'CREATE NEW PRODUCT',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
})


router.get('/details/:token', async (req, res) => {
    let unique = "Product::SingleDetails";
    let proceed = true;
    req.nativeRequest.endpoint = 'product/details/:token';
    if(proceed === true){
        let conditions = {
            'token' : req.params.token,
            'status' : 'Active',
            'existence' : 1
        }
        try {
            let singleRecord = await AppProduct.find(conditions);
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

router.post('/update/:token', async (req, res) => {
    let unique = "Product::UpdateProduct";
    let proceed = true;
    req.nativeRequest.endpoint = 'product/update/:token';
    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
        let tempImages = {
            'desktop' : 'https://live.staticflickr.com/943/39990157000_db6d1c8b37.jpg',
            'mobile' : 'https://live.staticflickr.com/943/39990157000_db6d1c8b37.jpg'
        }
        try {
            // @get previous record
            let previousRecord = await AppProduct.find({'token' : req.params.token});
            if (previousRecord.length == 1) {
                previousRecord = previousRecord[0];
                // @extract updateHistory key
                let updateHistory = previousRecord.updateHistory;
                // @make poppedRecord by deleting updateHistoryKey from previousRecord
                let poppedRecord = Object.assign({}, previousRecord);
                poppedRecord = poppedRecord._doc;
                delete poppedRecord.updateHistory;
                
                // @register a newHistoryItem
                let newHistoryItem = {
                    'recordId' : updateHistory.length + 1,
                    'poppedAtUTC' : system.utcNow(),
                    'poppedAtLocal' : system.localNow(),
                    'poppedAtMS' : system.unixMS(),
                    'poppedBy' : req.nativeRequest.userToken,
                    'poppedActivityToken' : req.nativeRequest.activityToken,
                    'poppedRecord' : JSON.parse(JSON.stringify(poppedRecord))
                };
                // @push newHistoryItem to updateHistory array of Database
                updateHistory.push(newHistoryItem);
                // @update record
                try {
                    let dataToUpdate = {
                        'title' : req.body.title,
                        'slug' : req.body.slug,
                        'sku' : req.body.sku,
                        'shortDetails' : req.body.shortDetails,
                        'details' : req.body.details,
                        'images' : tempImages,
                        'regularPrice' : req.body.regularPrice,
                        'discountedPrice' : req.body.discountedPrice,
                        'countablePrice' : req.body.countablePrice,
                        'nutritionalValues' : {'totalCalories' : req.body.calories},
                        'origin' : req.body.origin,
                        'updateHistory' : updateHistory
                    }
                    let updateRecord = await AppProduct.findOneAndUpdate(
                        {'token' : req.params.token},
                        {$set : dataToUpdate},
                        {new : true}
                    );
                    if(updateRecord){
                        // @send response
                        native.response({
                            'responseCode' : 'UPDATE_SUCCESSFUL',
                            'errorLog' : {},
                            'data' : {
                                'item' : updateRecord,
                                'count' : 1
                            }
                        }, req, res);
                    }
                    else{
                        // @send error response
                        native.response({
                            'responseCode' : 'TRY_AGAIN',
                            'errorLog' : {
                                'location' : unique,
                                'query' : `UPDATE EXISTING RECORD :: TOKEN :: ${req.params.token}`,
                                'details' : `Query Failed At try...catch :: ${error}`
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
                            'query' : `UPDATE EXISTING RECORD :: TOKEN :: ${req.params.token}`,
                            'details' : `Query Failed At try...catch :: ${error}`
                        },
                        'data' : {}
                    }, req, res);
                }
            }
            else{
                // @send error response
                native.response({
                    'responseCode' : 'TRY_AGAIN',
                    'errorLog' : {
                        'location' : unique,
                        'query' : `SELECT PREVIOUS RECORD :: TOKEN :: ${req.params.token}`,
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
                    'query' : `SELECT PREVIOUS RECORD :: TOKEN :: ${req.params.token}`,
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
});

router.post('/relate/category', async (req, res) => {
    let unique = "Product::UpdateProduct";
    let proceed = true;
    req.nativeRequest.endpoint = 'product/relate/category';
    // @sessionSource == SYSTEM_VALIDATED

    // @rule: check record - product
    try {
        var productDetails = await AppProduct.find({token : req.body.productToken});
        if (productDetails.length == 1) {
            productDetails = productDetails[0];
        } 
        else {
            proceed = false;
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : `SELECT PRODUCT DETAILS TO RELATE CATEGORY :: TOKEN :: ${req.body.productToken}`,
                    'details' : `No Record Found Using Product Token`
                },
                'data' : {}
            }, req, res);
        }
    } 
    catch (error) {
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'TRY_AGAIN',
            'errorLog' : {
                'location' : unique,
                'query' : `SELECT PRODUCT DETAILS TO RELATE CATEGORY :: TOKEN :: ${req.body.productToken}`,
                'details' : `Query Failed At try...catch :: ${error}`
            },
            'data' : {}
        }, req, res);
    }

    // @rule: check record - category
    try {
        var categoryDetails = await AppCategory.find({token : req.body.categoryToken});
        if (categoryDetails.length == 1) {
            categoryDetails = categoryDetails[0];
        } 
        else {
            proceed = false;
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : `SELECT CATEGORY DETAILS TO RELATE CATEGORY :: TOKEN :: ${req.body.categoryToken}`,
                    'details' : `No Record Found Using Category Token`
                },
                'data' : {}
            }, req, res);
        }
    } 
    catch (error) {
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'TRY_AGAIN',
            'errorLog' : {
                'location' : unique,
                'query' : `SELECT PRODUCT DETAILS TO RELATE CATEGORY :: TOKEN :: ${req.body.productToken}`,
                'details' : `Query Failed At try...catch :: ${error}`
            },
            'data' : {}
        }, req, res);
    }

    // @rule: check categoryDetails.flowType standalone or not
    if (categoryDetails.flowType == 'menuItem') {
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'TRY_AGAIN',
            'errorLog' : {
                'location' : unique,
                'query' : `CHECK CATEGORY FLOWTYPE`,
                'details' : `Only categories with 'standalone' flowType can be related to products `
            },
            'data' : {}
        }, req, res);
    }

    // @rule - check already related or not
    try {
        let numRecord = await AppCategoryAndProduct.find({'categoryToken' : req.body.categoryToken, 'productToken' : req.body.productToken});
        if (numRecord.length > 0) {
            proceed = false;
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : `CHECK ALREADY RELATED OR NOT`,
                    'details' : `Category and product relation already exists`
                },
                'data' : {}
            }, req, res);
        }
    } 
    catch (error) {
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'TRY_AGAIN',
            'errorLog' : {
                'location' : unique,
                'query' : `SELECT RELATION BY CATEGORY TOKEN AND PRODUCT TOKEN :: TOKENS :: ${req.body.productToken} :: ${req.body.categoryToken}`,
                'details' : `Query Failed At try...catch :: ${error}`
            },
            'data' : {}
        }, req, res);
    }
    // @get total records for position purpose
    try {
        var totalRecords = await AppCategoryAndProduct.countDocuments();
    } 
    catch (error) {
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'TRY_AGAIN',
            'errorLog' : {
                'location' : unique,
                'query' : `COUNT ALL DOCUMENTS`,
                'details' : `Query Failed At try...catch :: ${error}`
            },
            'data' : {}
        }, req, res);
    }

    // @proceed true
    if(proceed === true){
        // @insert record
        let token = utils.makeToken({label: 'AppPACT'});
        let dataToSave = {
            'token' : token,
            'categoryToken' : req.body.categoryToken,
            'categoryDetails' : categoryDetails,
            'productToken' : req.body.productToken,
            'productDetails' : productDetails,
            'productOrigin' : productDetails.origin,
            'position' : totalRecords + 1
        }
        dataToSave = Object.assign({}, dataToSave, utils.commonColumns(req.nativeRequest));
        let newRecord = new AppCategoryAndProduct(dataToSave);
        try {
            saveNewRecord = await newRecord.save();
            if(saveNewRecord){
                //@send success response
                native.response({
                    'responseCode' : 'INSERTION_SUCCESSFUL',
                    'errorLog' : {},
                    'data' : {
                        'item' : saveNewRecord,
                        'count' : 1
                    }
                }, req, res);
            }
            else{
                // @send error response
                native.response({
                    'responseCode' : 'TRY_AGAIN',
                    'errorLog' : {
                        'location' : unique,
                        'query' : `CREATE NEW PRODUCT AND CATEGORY RELATION :: TOKENS :: ${req.body.productToken} :: ${req.body.categoryToken}`,
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
                    'query' : `CREATE NEW PRODUCT AND CATEGORY RELATION :: TOKENS :: ${req.body.productToken} :: ${req.body.categoryToken}`,
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
});

router.get('/listByCategory/:categoryToken/:page/:limit/:origin', async (req, res) => {
    let unique = "Product::ListByCategory";
    let proceed = true;
    req.nativeRequest.endpoint = 'product/listByCategory/:categoryToken/:page/:limit/:origin';
    if(proceed === true){
        let categoryToken = req.params.categoryToken;
        let page = parseInt(req.params.page);
        let limit = parseInt(req.params.limit);
        let origin = req.params.origin;
        // @define startIndex
        const startIndex = (page - 1) * limit;
        // @define endIndex
        const endIndex = page * limit;
        // @get records
        try {
            if (origin == 'All') {
                var records = await AppCategoryAndProduct.find({
                    'categoryToken' : categoryToken,
                    'status' : 'Active',
                    'existence' : 1
                }).limit(limit).skip(startIndex);
            }
            else{
                var records = await AppCategoryAndProduct.find({
                    'categoryToken' : categoryToken,
                    'productOrigin' : origin,
                    'status' : 'Active',
                    'existence' : 1
                }).limit(limit).skip(startIndex);
            }
            
            //@send success response
            native.response({
                'responseCode' : 'LIST_LOADED',
                'errorLog' : {},
                'data' : {
                    'next' : page + 1,
                    'previous' : page - 1,
                    'count' : limit,
                    'items' : records
                }
            }, req, res);
            
        } 
        catch (error) {
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : `SELECT PRODUCTS PAGINATED BY CATEGORY`,
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
});



/* router.post('/new', async (req, res) => {
    let unique = "Product::NewProduct";
    let proceed = true;
    req.nativeRequest.endpoint = 'product/new';
    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
        let tempImages = {
            'desktop' : 'https://live.staticflickr.com/943/39990157000_db6d1c8b37.jpg',
            'mobile' : 'https://live.staticflickr.com/943/39990157000_db6d1c8b37.jpg'
        }
        let token = utils.makeToken({label: 'AppPT'}); 
        let dataToSave = {
            'token' : token,
            'title' : req.body.title,
            'slug' : req.body.slug,
            'sku' : req.body.sku,
            'shortDetails' : req.body.shortDetails,
            'details' : req.body.details,
            'images' : tempImages,
            'regularPrice' : req.body.regularPrice,
            'discountedPrice' : req.body.discountedPrice,
            'countablePrice' : req.body.countablePrice,
            'eatable' : req.body.eatable,
            'nutritionalValues' : {'totalCalories' : req.body.calories},
            'origin' : req.body.origin
        };
        dataToSave = Object.assign({}, dataToSave, utils.commonColumns(req.nativeRequest));
        let newRecord = new AppProduct(dataToSave);
        try {
            saveNewRecord = await newRecord.save();
            if(saveNewRecord){
                // @send response
                native.response({
                    'responseCode' : 'INSERTION_SUCCESSFUL',
                    'errorLog' : {},
                    'data' : {
                        'item' : saveNewRecord,
                        'count' : 1
                    }
                }, req, res);
            }
            else{
                // @send error response
                native.response({
                    'responseCode' : 'TRY_AGAIN',
                    'errorLog' : {
                        'location' : unique,
                        'query' : 'CREATE NEW PRODUCT',
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
                    'query' : 'CREATE NEW PRODUCT',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
}); */








module.exports = router;