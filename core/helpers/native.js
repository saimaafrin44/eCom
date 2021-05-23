const useragent = require('useragent'); // module
const system = require('./system'); // native
const utils = require('./utils'); // native
const  {messages } = require('../datasets/messages'); // native
const SysActivity = require('../models/system/Activity'); // mongoose model


const emails = {
    'support' : 'support@sodaimama.com',
    'engineeringHQ' : 'ehq@sodaimama.com',
    'bugReport' : 'bugs@sodaimama.com',
    'issues' : 'issues@sodaimama.com'
}

const publicDir = {
    'files' : 'files',
    'images' : {
        'root' : 'images',
        'app' : {
            'categories' : 'categories'
        }
    }
}

const response = async (v, req, res) => {
    let nativeRequest = req.nativeRequest;
    let responseSizeInBytes = ''; // @todo
    let responseTime = system.unixMS();
    let message = utils.searchInDataset(messages, v.responseCode);
    let dataToUpdate = {
        'endpoint' : nativeRequest.endpoint,
        'responseType' : message.type,
        'responseMessage' : message,
        'response' : v,
        'responseSizeInBytes' : responseSizeInBytes,
        'requestTime' : nativeRequest.requestTime,
        'responseTime' : responseTime,
        'elapsedTime' : responseTime - nativeRequest.requestTime,
        'errorLog' : v.errorLog
    }
    try {
        let updateActivity = await SysActivity.findOneAndUpdate(
            {'token' : nativeRequest.activityToken},
            {$set : dataToUpdate},
            {new : true}
        );
        responseHelper({
            'dataState' : message.dataState,
            'message' : message,
            'errorLog' : v.errorLog,
            'data' : v.data,
            'resState' : '😎'
        }, res)
    } catch (error) {
        // @todo
        responseHelper({
            'dataState' : '💣',
            'message' : message,
            'errorLog' : v.errorLog,
            'data' : v.data,
            'resState' : '😲'
        }, res)
    }
}

const responseHelper = (v, res) => {
    res.status(200).json({
        'responseTimeUTC' : system.utcNow(),
        'responseTimeLocal' : system.localNow(),
        'dataState' : v.dataState,
        'message' : v.message,
        'errorLog' : v.errorLog,
        'data' : v.data,
        'resState' : v.resState,
        'apiVersion' : 'v1.0.0',
        'stableRelease' : 'May 22, 2021',
        'credits' : {
            'Software And System Architect' : {
                'Name' : 'Istiaq Hasan',
                'Email' : 'istiaq.me@gmail.com'
            },
            'Backend' : [
                {
                    'Name' : 'Md Ariful Islam Saikat',
                    'Email' : 'saikat.geek@gmail.com'
                },
                {
                    'Name' : 'Saima Afrin',
                    'Email' : 'saimaafrin44@gmail.com'
                }
            ],
            'Mobile App' : [
                {
                    'Name' : 'Md Jewel Rana',
                    'Email' : 'tonujewel@gmail.com'
                }
            ],
            'Frontend' : [
                {
                    'Name' : 'AKJM Al Amin',
                    'Email' : ''
                },
                {
                    'Name' : 'Mohammad Sohail',
                    'Email' : ''
                }
            ]
        }
    });
}

const responseBastard = async (v, req, res) => {
    let nativeRequest = req.nativeRequest;
    let responseSizeInBytes = system.objectSizeInBytes(v.data);
    let responseTime = system.unixMS();
    let message = utils.searchInDataset(messages, v.responseCode);
    // @insert a Bastard activity
    let token = utils.makeToken({label: 'SysAT__TraceRoot__Bastard_'}); 
    let newSysActivity = new SysActivity({
        'token' : token,
        'origin' : 'Bastard',
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
    try { 
        let saveNewSysActivity = await newSysActivity.save();
        if (saveNewSysActivity) {
            let dataToUpdate = {
                'endpoint' : nativeRequest.endpoint,
                'responseType' : message.type,
                'responseMessage' : message,
                'response' : v,
                'responseSizeInBytes' : responseSizeInBytes,
                'requestTime' : nativeRequest.requestTime,
                'responseTime' : responseTime,
                'elapsedTime' : responseTime - nativeRequest.requestTime,
                'errorLog' : v.errorLog
            };
            try {
                let updateActivity = await SysActivity.findOneAndUpdate(
                    {'token' : token},
                    {$set : dataToUpdate},
                    {new : true}
                );
                responseHelper({
                    'dataState' : message.dataState,
                    'message' : message,
                    'errorLog' : v.errorLog,
                    'data' : v.data,
                    'resState' : '😎'
                }, res)
            } catch (error) {
                // @send error response
                res.status(200).json({
                    'dataState' : '👹👿👹👿👹👿👹👿👹👿👹👿👹👿',
                    'responseUTC' : system.utcNow(),
                    'todo' : `Critical DB Error. Please Report A Bug Issue With Screenshot to ${emails.bugReport}. Subject: USA::Bastard::CATCH::${token} 😭😭😭😭😭😭😭`,
                    'message' : message,
                    'errorLog' : v.errorLog,
                    'data' : v.data,
                    'resState' : '🚓🚓🚓🚓🚓🚓'
                });
            }
        } 
        else {
            res.status(200).json({
                'dataState' : '👹👿👹👿👹👿👹👿👹👿👹👿👹👿',
                'responseUTC' : system.utcNow(),
                'todo' : `Critical DB Error. Please Report A Bug Issue With Screenshot to ${emails.bugReport}. Subject: NSA::Bastard::BEFORE_CATCH 😭😭😭😭😭😭😭`,
                'message' : message,
                'errorLog' : v.errorLog,
                'data' : v.data,
                'resState' : '🚓🚓🚓🚓🚓🚓'
            });
        }
    } 
    catch (error) { // <!-- TRY...CATCH --!> - END - newSysActivity
        // @send error response
        res.status(200).json({
            'dataState' : '👹👿👹👿👹👿👹👿👹👿👹👿👹👿',
            'responseUTC' : system.utcNow(),
            'todo' : `Critical DB Error. Please Report A Bug Issue to ${emails.bugReport}. Subject: NSA::Bastard::CATCH 😭😭😭😭😭😭😭`,
            'message' : message,
            'errorLog' : v.errorLog,
            'data' : v.data,
            'resState' : '🚓🚓🚓🚓🚓🚓'
        });
    }
}

exports.emails = emails;
exports.publicDir = publicDir;
exports.response = response;
exports.responseBastard = responseBastard;