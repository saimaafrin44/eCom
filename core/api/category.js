const express = require('express'); // module
const router = express.Router(); // module
const multer = require('multer'); // module
const fileUpload = require('../helpers/fileUpload'); // native
const native = require('../helpers/native'); // native
const utils = require('../helpers/utils'); // native
const AppCategory = require('../models/app/Category'); // mongoose model


router.get('/', async (req, res) => {
    let unique = "CategoryRoot";
    let proceed = true;
    req.nativeRequest.endpoint = 'category';
    native.response({
        'responseCode' : 'YOU_ARE_LOST',
        'errorLog' : {
            'location' : unique,
            'code' : '404'
        },
        'data' : {}
    }, req, res)
}); 

router.post('/relation/new', async (req, res) => { // @todo - proceed true and business logic
    let unique = "Category::NewCategoryRelation";
    let proceed = true;
    req.nativeRequest.endpoint = 'category/relation/new';
    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
        // @get existing category
        let withCategory = await AppCategory.find({'token' : req.body.withCategoryToken});
        if (withCategory.length == 1) {
            // @determine flowType proceed
            // @rule:: flowType = standalone can only have Parent, flowType = menuItem can have both Parent and Child
            let flowTypeProceed = true;
            if (withCategory.flowType == 'menuItem') {
                flowTypeProceed = true;
            } else if (withCategory.flowType == 'standalone') {
                if (req.body.relateAs == 'Child') {
                    flowTypeProceed = false;
                }
            }
            else{
                flowTypeProceed = false;
            }
            // @block - flowTypeProceed
            if (flowTypeProceed === true) {
                // @define relation schema
                let relationSchema = {
                    'categoryToken' : toRelateCategoryToken
                }
                try {
                    if (req.body.relateAs == 'Parent') {
                        var updateRecord = await AppCategory.findOneAndUpdate(
                            {'token' : req.body.withCategoryToken},
                            {$set : {'parents' : withCategory.parents.push(relationSchema)}},
                            {new : true}
                        );
                    } 
                    else {
                        var updateRecord = await AppCategory.findOneAndUpdate(
                            {'token' : req.body.withCategoryToken},
                            {$set : {'parents' : withCategory.children.push(relationSchema)}},
                            {new : true}
                        );
                    }
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
                            'query' : 'CREATE NEW CATEGORY',
                            'details' : `Query Failed At try...catch :: ${error}`
                        },
                        'data' : {}
                    }, req, res);
                }
            } 
            else {
                // @send error response
                native.response({
                    'responseCode' : 'SYSTEM_RULE_VIOLATION_ERROR',
                    'errorLog' : {
                        'location' : unique,
                        'query' : `flowTypeProceed is false`,
                        'details' : `Scenario :: withCategory flowType = ${withCategory.flowType} :: req relateAs = ${req.body.relateAs} `
                    },
                    'data' : {}
                }, req, res);
            }
        }
        else {
            // @send error response
            native.response({
                'responseCode' : 'RECORD_DOES_NOT_EXIST',
                'errorLog' : {
                    'location' : unique,
                    'query' : `SELECT CATEGORY BY TOKEN :: ${req.body.withCategoryToken}`,
                    'details' : `Result Length Error`
                },
                'data' : {}
            }, req, res);
        }
    }
});


router.post('/new', async (req, res) => {
    let unique = "Category::NewCategory";
    let proceed = true;
    req.nativeRequest.endpoint = 'category/new';

    // @get total records for positionKey purpose
    try {
        var totalRecords = await AppCategory.countDocuments();
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

    let positionKey = '10' + (totalRecords + 1);
    positionKey = parseInt(positionKey);

    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
        let tempImages = {
            'desktop' : 'https://live.staticflickr.com/943/39990157000_db6d1c8b37.jpg',
            'mobile' : 'https://live.staticflickr.com/943/39990157000_db6d1c8b37.jpg'
        }
        let token = utils.makeToken({label: 'AppCT'}); 
        let dataToSave = {
            'token' : token,
            'title' : req.body.title,
            'slug' : req.body.slug,
            'flowType' : req.body.flowType,
            'positionKey' : positionKey,
            'images' : tempImages,
            'parents' : [],
            'children' : []
        };
        dataToSave = Object.assign({}, dataToSave, utils.commonColumns(req.nativeRequest));
        let newRecord = new AppCategory(dataToSave);
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
                    'query' : 'CREATE NEW CATEGORY',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
})


/* router.post('/new', multer({ storage: fileUpload.fileStorage('categories'), fileFilter: fileUpload.fileFilter }).single('categoryImage'), async (req, res) => {
    let unique = "Category::NewCategory";
    let proceed = true;
    req.nativeRequest.endpoint = 'category/new';

    // Error Handling - Upload Image
    let file = req.file
    if (!file) {
      let error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next("hey error")
    }

    // @get total records for positionKey purpose
    try {
        var totalRecords = await AppCategory.countDocuments();
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

    let positionKey = '10' + 1;
    positionKey = parseInt(positionKey);


    // @sessionSource == SYSTEM_VALIDATED
    if (proceed === true){
      let tempImages = {
        'desktop' : req.token + '_desktop' + req.imageExtension,
        'mobile' :  req.token + '_mobile' + req.imageExtension
      }

        let token = utils.makeToken({label: 'AppPT'}); 
        let dataToSave = {
            'token' : token,
            'title' : req.body.title,
            'slug' : req.body.slug,
            'flowType' : req.body.sku,
            'positionKey' : positionKey,
            'images' : tempImages,
            'parents' : [],
            'children' : []
        };
        dataToSave = Object.assign({}, dataToSave, utils.commonColumns(req.nativeRequest));
        let newRecord = new AppCategory(dataToSave);
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
                    'query' : 'CREATE NEW CATEGORY',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
}) */






module.exports = router;