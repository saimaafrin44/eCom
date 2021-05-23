// @dependencies
const moment = require('moment') // npm

// @return dateTime for DB format (YYYY-MM-DD HH:mm:ss) - requires moment js - - Author: Istiaq Hasan
const dateTime = () => {
    let currentTimestamp = moment().unix();//in seconds
    let currentDatetime = moment(currentTimestamp*1000).format("YYYY-MM-DD HH:mm:ss"); //mysql datetime.
    // @returns dateTime in UTC (GMT) value. 
    return currentDatetime;
}

// @return dateTime for DB format (YYYY-MM-DD T HH:mm:ss) in UTC - requires moment js - - Author: Istiaq Hasan
const utcNow = () => {
    let today = moment(new Date()).utc().format();
    return today;
}

// @return dateTime for DB format (YYYY-MM-DD T HH:mm:ss) in UTC - requires moment js - - Author: Istiaq Hasan
const localNow = () => {
    let today = moment(new Date()).format();
    return today;
}

// @return UNIX milliseconds requires moment js - Author: Istiaq Hasan
const unixMS = () => {
   return moment().format('x');
}

// @do not change this after the app is deployed - Author: Istiaq Hasan
const formats = {
    userToken : 'ISTIAQ_HASAN________sysGuestUser_ISTIAQ_HASAN_ts',
    sessionToken : 'ISTIAQ_HASAN________sysGuestSession_ISTIAQ_HASAN_ts',
    deviceToken : 'ISTIAQ_HASAN________sysGuestUser_ISTIAQ_HASAN_ts',
    deviceSessionToken : 'ISTIAQ_HASAN________sysGuestDevice_ISTIAQ_HASAN_ts',
    activityToken : 'ISTIAQ_HASAN________sysGuestActivity_ISTIAQ_HASAN_ts'
}

// @returns formatted clean json for need request items - Author: Istiaq Hasan
const resetRequest = (req) =>{
    return {
        'req' : 'To Do'
    }
}

const objectSizeInBytes = ( value, level ) => {
    if(level == undefined) level = 0;
    var bytes = 0;

    if ( typeof value === 'boolean' ) {
        bytes = 4;
    }
    else if ( typeof value === 'string' ) {
        bytes = value.length * 2;
    }
    else if ( typeof value === 'number' ) {
        bytes = 8;
    }
    else if ( typeof value === 'object' ) {
        if(value['__visited__']) return 0;
        value['__visited__'] = 1;
        for( i in value ) {
            bytes += i.length * 2; 
            bytes+= 8; // an assumed existence overhead
            bytes+= objectSizeInBytes( value[i], 1 )
        }
    }

    if(level == 0){
        clear__visited__(value);
    }
    return bytes;
}

function clear__visited__(value){
    if(typeof value == 'object'){
        delete value['__visited__'];
        for(var i in value){
            clear__visited__(value[i]);
        }
    }
}

// @sets native items to push in the default request object to get in the lifecycle of request and response - Author: Istiaq Hasan
const setNativeRequest = (req) => {
    let nativeRequest = {};
    // appToken
    if (req.headers.hasOwnProperty('app-token')) {
        nativeRequest.appToken = req.header('app-token')
    }
    else{
        nativeRequest.appToken = 'WRONG APPTOKEN';
    }
    // appKey
    if (req.headers.hasOwnProperty('app-key')) {
        nativeRequest.appKey = req.header('app-key')
    }
    else{
        nativeRequest.appKey = 'WRONG APPKEY';
    }
    // appPassword
    if (req.headers.hasOwnProperty('app-password')) {
        nativeRequest.appPassword = req.header('app-password')
    }
    else{
        nativeRequest.appPassword = 'WRONG PASSWORD';
    }
    // source
    if (req.headers.hasOwnProperty('source')) {
        nativeRequest.source = req.header('source')
    }
    else{
        nativeRequest.source = 'UNDEFINED_HITSOURCE';
    }
    // language
    if (req.headers.hasOwnProperty('language')) {
        nativeRequest.language = req.header('language')
    }
    else{
        nativeRequest.language = 'en';
    }
    // permission
    if (req.headers.hasOwnProperty('permission')) {
        nativeRequest.permission = req.header('permission')
    }
    else{
        nativeRequest.permission = 'UNDEFINED_PERMISSION';
    }
    // contentType
    if (req.headers.hasOwnProperty('content-type')) {
        nativeRequest.contentType = req.header('content-type')
    }
    else{
        nativeRequest.contentType = ' If Not Uploading File .... Please Change content-type to application/json; charset=utf-8';
    }
    // userToken
    if (req.headers.hasOwnProperty('user-token')) {
        nativeRequest.userToken = req.header('user-token')
    }
    else{
        nativeRequest.userToken = formats.userToken + unixMS();
    }
    // sessionToken
    if (req.headers.hasOwnProperty('session-token')) {
        nativeRequest.sessionToken = req.header('session-token')
    }
    else{
        nativeRequest.sessionToken = formats.sessionToken + unixMS();
    }
    // deviceToken
    if (req.headers.hasOwnProperty('device-token')) {
        let currentValue = req.header('device-token')
        // TO DO - check system
        if (currentValue !== "") {
            nativeRequest.deviceToken = req.header('device-token')
        } else if (currentValue !== null) {
            nativeRequest.deviceToken = req.header('device-token')
        }
        else{
            nativeRequest.deviceToken =  formats.deviceToken + unixMS();
        }
    }
    else{
        nativeRequest.deviceToken = formats.deviceToken + unixMS();
    }
    // deviceSessionToken
    if (req.headers.hasOwnProperty('device-session-token')) {
        nativeRequest.deviceSessionToken = req.header('device-session-token')
    }
    else{
        nativeRequest.deviceSessionToken = formats.deviceSessionToken + unixMS();
    }
    
    // deviceId
    if (req.headers.hasOwnProperty('device-id')) {
        nativeRequest.deviceId = req.header('device-id')
    }

    // deviceInfo
    if (req.headers.hasOwnProperty('device-info')) {
        nativeRequest.deviceInfo = req.header('device-info')
    }
    
    // WILDCARDS
    nativeRequest.ipAddress = req.ip;
    nativeRequest.userAgent = req.header('user-agent');
    nativeRequest.basePath = req.path;
    nativeRequest.requestMethod = req.method;
    nativeRequest.requestedTo = 'SodaiMama Core Engine API V1.0.0 :: Stable Release :: May 25, 2021';
    nativeRequest.endpoint = 'Middleware::CentralAuthenticator';
    nativeRequest.originalURL = req.originalUrl;
    nativeRequest.activityToken = formats.activityToken + unixMS();
    nativeRequest.requestTime = unixMS();
    return nativeRequest;
}


exports.dateTime = dateTime;
exports.utcNow = utcNow;
exports.localNow = localNow;
exports.unixMS = unixMS;
exports.formats = formats;
exports.setNativeRequest = setNativeRequest;
exports.objectSizeInBytes = objectSizeInBytes;
exports.resetRequest = resetRequest;