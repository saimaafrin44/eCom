const express = require('express'); // module
const router = express.Router(); // module
const native = require('../helpers/native'); // native
const utils = require('../helpers/utils'); // native
const challenges = require('../helpers/challenges'); // native
const AppCategory = require('../models/app/Category'); // mongoose model


router.get('/', async (req, res) => {
    let unique = "AuthRoot";
    let proceed = true;
    req.nativeRequest.endpoint = 'auth';
    native.response({
        'responseCode' : 'YOU_ARE_LOST',
        'errorLog' : {
            'location' : unique,
            'code' : '404'
        },
        'data' : {}
    }, req, res)
});

router.post('/sendOTP', async (req, res) => {
    let unique = "Auth::SendOTP";
    let proceed = true;
    req.nativeRequest.endpoint = 'auth/sendOTP';

    // @rule - sessionSource SYSTEM_VALIDATED

    // @rule - check 11 digit
    if(req.body.phone.length != 11){
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'PHONE_DIGIT_LENGTH_ERROR',
            'errorLog' : {
                'location' : unique,
                'query' : `PHONE NUMBER DIGIT LENGTH`,
                'details' : `A Bangladeshi Phone Number Should Have 11 Digits With 0 At Starting`
            },
            'data' : {}
        }, req, res);
    }

    // @rule - check phone operators
    let phoneOperator = utils.phoneOperator(req.body.phone)
    if(phoneOperator.match == 'No'){
        proceed = false;
        // @send error response
        native.response({
            'responseCode' : 'PHONE_NUMBER_OPERATOR_ERROR',
            'errorLog' : {
                'location' : unique,
                'query' : `PHONE NUMBER DIGIT LENGTH`,
                'details' : `Provided Phone Number Is Not From Any Bangladeshi Operator`
            },
            'data' : {}
        }, req, res);
    }

    // @rule - daily limit

    
    if(proceed === true){
        // @generate OTP
        let OTP = utils.numRand(6);

    }

});





module.exports = router;