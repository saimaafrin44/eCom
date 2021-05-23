const useragent = require('useragent'); // module
const express = require('express'); // module
const router = express.Router(); // module
const native = require('../helpers/native'); // native
const utils = require('../helpers/utils'); // native
const SysDevice = require('../models/system/Device'); // mongoose model


router.get('/', async (req, res) => {
    let unique = "SystemRoot";
    let proceed = true;
    req.nativeRequest.endpoint = '';
    native.response({
        'responseCode' : 'YOU_ARE_LOST',
        'errorLog' : {
            'location' : unique,
            'code' : '404'
        },
        'data' : {}
    }, req, res)
});

router.post('/test', async (req, res) => {
    console.log(req)
    res.send('bingo: ' + req.body.bingo)
});

router.post('/register/device', async (req, res) => {
    let unique = "System::NewDeviceToken";
    let proceed = true;
    req.nativeRequest.endpoint = 'system/device/new';
    
    if (proceed === true){
        let token = utils.makeToken({label: 'SysDT'}); 
        let dataToSave = {
            'token' : token,
            'deviceSessionToken' : req.nativeRequest.deviceSessionToken,
            'appToken' : req.nativeRequest.appToken,
            'appToken' : req.nativeRequest.appToken,
            'userAgent' : useragent.parse(req.nativeRequest.userAgent).toJSON(),
            'ipAddress' : req.nativeRequest.ipAddress,
            'source' : req.nativeRequest.source,
            'deviceId' : req.nativeRequest.deviceId,
            'deviceInfo' : req.nativeRequest.deviceInfo
        };
        dataToSave = Object.assign({}, dataToSave, utils.commonColumns(req.nativeRequest));
        let newSysDevice = new SysDevice(dataToSave);
        try {
            saveNewSysDevice = await newSysDevice.save();
            // @send response
            native.response({
                'responseCode' : 'INSERTION_SUCCESSFUL',
                'errorLog' : {},
                'data' : {
                    'item' : saveNewSysDevice,
                    'count' : 1
                }
            }, req, res);
        } 
        catch (error) {
            // @send error response
            native.response({
                'responseCode' : 'TRY_AGAIN',
                'errorLog' : {
                    'location' : unique,
                    'query' : 'CREATE NEW DEVICE',
                    'details' : `Query Failed At try...catch :: ${error}`
                },
                'data' : {}
            }, req, res);
        }
    }
})






module.exports = router;