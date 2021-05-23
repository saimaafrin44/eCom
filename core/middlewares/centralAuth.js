/* 
    @@ Middlware Architecture @@
    @ Author : Istiaq Hasan
    @ Email: istiaq.me@gmail.com
    @ Detailed Diagram: http://istiaq.com/originals/files/centralauth-middleware-architecture-for-ecommerce-site-maca.jpg
    @ Details: http://istiaq.com/originals/architectures/centralauth-middleware-architecture-for-ecommerce-site-maca.jpg
*/
// @dependencies
const useragent = require('useragent'); // module
const system = require('../helpers/system'); // native
const utils = require('../helpers/utils'); // native
const challenges = require('../helpers/challenges'); // native
const native = require('../helpers/native'); // native
const SysActivity = require('../models/system/Activity'); // mongoose model
const SysDevice = require('../models/system/Device'); // mongoose model
const SysSession = require('../models/system/Session'); // mongoose model
// !!BLOCK!! - @START@ - centralAuth function
const centralAuth = (v) => {
    // !!BLOCK!! - @START@ - centralAuth async
    return async function(req, res, next){
        let proceed = true; // 
        let unique = "Middleware::CentralAuthenticator";
        let nativeRequest = system.setNativeRequest(req);
        nativeRequest.baseRoute = v.baseRoute;
        let requestSizeInBytes = system.objectSizeInBytes(nativeRequest); // @todo - nativeRequest resizing and object sizing
        // @check initial access
        if (challenges.initialAccess({}) === false) {
            proceed = false;
        }
        // !!BLOCK!! - @START@ - proceed = true
        if (proceed === true) {
            let blockProceed = true;
            // !! BLPR !! - @START@ - deviceToken format
            if (nativeRequest.deviceToken.includes(system.formats.deviceToken)) {
                nativeRequest.deviceSource = 'SYSTEM_GENERATED';
            } else { // !! BLPR !! - @ELSE@ - deviceToken format
                // @check deviceToken exists in database or not
                let conditions = {
                    'token' : nativeRequest.deviceToken,
                    'appToken' : nativeRequest.appToken,
                    'source' : nativeRequest.source,
                    'existence' : 1
                }
                try {
                    let device = await SysDevice.find(conditions);
                    if (device.length != 0) {
                        nativeRequest.deviceSource = 'SYSTEM_VALIDATED';
                    } else {
                        blockProceed = false;
                        // @send error response
                        req.nativeRequest = nativeRequest;
                        native.responseBastard({
                            'responseCode' : 'DEVICE_TOKEN_MISMATCHED',
                            'errorLog' : {
                                'keyword' : `Token Mismatched :: CheckDevice ::  ${unique}`,
                                'details' : ''
                            },
                            'data' : {}
                        }, req, res);
                    }
                } 
                catch (error) {
                    // @send error response
                    req.nativeRequest = nativeRequest;
                    native.responseBastard({
                        'responseCode' : 'SYSTEM_ERROR_QUERY_EXECUTION',
                        'errorLog' : {
                            'keyword' : `Mongoose Try...Catch Error :: CheckDevice ::  ${unique}`,
                            'details' : `${error}`
                        },
                        'data' : {}
                    }, req, res);
                }
            }
            // !! BLPR !! - @END@ - deviceToken format

            // !! BLPR !! - @START@ - sessionToken format
            if (nativeRequest.sessionToken.includes(system.formats.sessionToken)) {
                nativeRequest.sessionSource = 'SYSTEM_GENERATED';
            } else { // !! BLPR !! - @ELSE@ - sessionToken format
                // @check sessionToken exists in database or not
                let conditions = {
                    'token' : nativeRequest.deviceToken,
                    'appToken' : nativeRequest.appToken,
                    'userToken' : nativeRequest.userToken,
                    // @todo
                    'source' : nativeRequest.source,
                    'existence' : 1
                }
                try {
                    let session = await SysSession.find(conditions);
                    if (session.length != 0) {
                        nativeRequest.sessionSource = 'SYSTEM_VALIDATED';
                    } else {
                        blockProceed = false;
                        // @send error response
                        req.nativeRequest = nativeRequest;
                        native.responseBastard({
                            'responseCode' : 'USER_SESSION_MISMATCHED',
                            'errorLog' : {
                                'keyword' : `Token Mismatched :: CheckSession ::  ${unique}`,
                                'details' : ''
                            },
                            'data' : {}
                        }, req, res);
                    }
                } 
                catch (error) {
                    // @send error response
                    req.nativeRequest = nativeRequest;
                    native.responseBastard({
                        'responseCode' : 'SYSTEM_ERROR_QUERY_EXECUTION',
                        'errorLog' : {
                            'keyword' : `Mongoose Try...Catch Error :: CheckDevice ::  ${unique}`,
                            'details' : `${error}`
                        },
                        'data' : {}
                    }, req, res);
                }
            }
            // !! BLPR !! - @END@ - sessionToken format

            // !!BLOCK!! - @START@ - blockProceed = true
            if (blockProceed === true) {
                // @insert a new activityLog with try...catch
                try { 
                    let token = utils.makeToken({label: 'SysAT'}); 
                    let newSysActivity = new SysActivity({
                        'token' : token,
                        'origin' : 'Legit',
                        'deviceToken' : nativeRequest.deviceToken,
                        'deviceSessionToken' : nativeRequest.deviceSessionToken,
                        'appToken' : nativeRequest.appToken,
                        'userToken' : nativeRequest.userToken,
                        'sessionToken' : nativeRequest.sessionToken,
                        'userAgent' : useragent.parse(nativeRequest.userAgent).toJSON(),
                        'ipAddress' : nativeRequest.ipAddress,
                        'source' : nativeRequest.source,
                        'requestMethod' : nativeRequest.requestMethod,
                        'requestedTo' : nativeRequest.requestedTo,
                        'originalURL' : nativeRequest.originalURL,
                        'request' : system.resetRequest(req), //@todo
                        'requestSizeInBytes' : '', //@todo
                        'createdBy' : nativeRequest.userToken
                    });
                    let saveNewSysActivity = await newSysActivity.save();
                    nativeRequest.activityToken = token;
                    req.nativeRequest = nativeRequest;
                    next();
                } 
                catch (error) { // <!-- TRY...CATCH --!> - END - newSysActivity
                    // @send error response
                    req.nativeRequest = nativeRequest;
                    native.responseBastard({
                        'responseCode' : 'SYSTEM_ERROR_QUERY_EXECUTION',
                        'errorLog' : {
                            'keyword' : `Mongoose Try...Catch Error :: NewSysActivity ::  ${unique}`,
                            'details' : `${error}`
                        },
                        'data' : {}
                    }, req, res);
                }
            } 
            // !!BLOCK!! - @END@ - blockProceed = true
        } 
        // !!BLOCK!! - @END@ - proceed = true
    } 
    // !!BLOCK!! - @END@ - centralAuth async
} 
// !!BLOCK!! - @END@ - centralAuth function


exports.centralAuth = centralAuth