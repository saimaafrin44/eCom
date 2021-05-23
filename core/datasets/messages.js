const messages = [
    {
        'token' : 'INSERTION_SUCCESSFUL',
        'dataState' : '😘',
        'message' : 'A Row Has Been Inserted Successfully',
        'type' : 'SUCCESS',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed' 
    },
    {
        'token' : 'UPDATE_SUCCESSFUL',
        'dataState' : '😘',
        'message' : 'A Row Has Been Updated Successfully',
        'type' : 'SUCCESS',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed' 
    },
    {
        'token' : 'LIST_LOADED',
        'dataState' : '😘',
        'message' : 'Requested List Has Been Loaded Successfully',
        'type' : 'SUCCESS', 
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'REQUIRED_HEADER_KEY_ERROR',
        'dataState' : '💣',
        'message' : 'Pre requisite header key is not present',
        'type' : 'ERROR', 
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'REQUIRED_HEADER_KEY_VALUE_ERROR',
        'dataState' : '💣',
        'message' : 'Pre requisite header key value is not present',
        'type' : 'ERROR', 
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'REQUIRED_HEADER_KEY_ERROR_IN_CREATING_DEVICE_TOKEN',
        'dataState' : '💣',
        'message' : 'Pre requisite header key value is not present',
        'type' : 'ERROR', 
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'REQUIRED_HEADER_KEY_VALUE_ERROR_IN_CREATING_DEVICE_TOKEN',
        'dataState' : '💣',
        'message' : 'Pre requisite header key value is not present',
        'type' : 'ERROR', 
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'WATCHWORD_MISMATCH',
        'dataState' : '💣',
        'message' : 'INTRUSION',
        'type' : 'ERROR', 
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'ROW_EXISTS',
        'dataState' : '🙄',
        'message' : 'Requested Row Exists',
        'type' : 'SUCCESS', 
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'RECORD_DOES_NOT_EXIST',
        'dataState' : '😵',
        'message' : 'Record Not Found With Requested Parameters',
        'type' : 'ERROR', 
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'MAN_IN_THE_MIDDLE_HEADER_VALUE_MANIPULATED',
        'dataState' : '🤨',
        'message' : '-----------------------আম পাতা জোড়া জোড়া/মারবো চাবুক চড়বো ঘোড়া/ওরে হকার (হ্যাকার) সরে দাড়া/পিষে মারবে পাগলা ঘোড়া-----------------------আরো শিখতে হবে, জানতে হবে বাছাধন/শেখো, শেখা প্র্যাকটিস করো, জানো, জানা প্র্যাকটিস করো ====== বাণীতেঃ জ্ঞানী কবি জনাব ইশতিয়াক সাহেব - https://www.linkedin.com/in/istiaqme/',
        'type' : 'ERROR', 
        'entity' : 'APP',
        'identifier' : '43::12::06'
    },
    {
        'token' : 'WATCHWORD_AND_ENDPOINT_MISMATCH_VIOLATION',
        'dataState' : '🤨',
        'message' : '-----------------------আম পাতা জোড়া জোড়া/মারবো চাবুক চড়বো ঘোড়া/ওরে হকার (হ্যাকার) সরে দাড়া/পিষে মারবে পাগলা ঘোড়া-----------------------আরো শিখতে হবে, জানতে হবে বাছাধন/শেখো, শেখা প্র্যাকটিস করো, জানো, জানা প্র্যাকটিস করো ====== বাণীতেঃ জ্ঞানী কবি জনাব ইশতিয়াক সাহেব - https://www.linkedin.com/in/istiaqme/',
        'type' : 'ERROR', 
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'USER_SESSION_MISMATCHED',
        'dataState' : '🤨',
        'message' : 'Session Is Expired For This Device. Re Login',
        'type' : 'ERROR',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'WILDCARD_SYSTEM_ERROR',
        'dataState' : '😓',
        'message' : 'Immidiately Report An Issue To The Backend Team. System Has Fallen Down',
        'type' : 'ERROR',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'SYSTEM_FIREWALL_BREACH_ATTEMPT',
        'dataState' : '🤨',
        'message' : '-----------------------আম পাতা জোড়া জোড়া/মারবো চাবুক চড়বো ঘোড়া/ওরে হকার (হ্যাকার) সরে দাড়া/পিষে মারবে পাগলা ঘোড়া-----------------------আরো শিখতে হবে, জানতে হবে বাছাধন/শেখো, শেখা প্র্যাকটিস করো, জানো, জানা প্র্যাকটিস করো ====== বাণীতেঃ জ্ঞানী কবি জনাব ইশতিয়াক সাহেব - https://www.linkedin.com/in/istiaqme/',
        'type' : 'ERROR',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'RECORD_EXISTS',
        'dataState' : '🙄',
        'message' : 'Record Exists In The System. No Need To Re Initiate',
        'type' : 'ERROR',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'DEVICE_TOKEN_MISMATCHED',
        'dataState' : '🤨',
        'message' : 'Device Token Violation.',
        'type' : 'ERROR',
        'entity' : 'APP',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'SYSTEM_ERROR_QUERY_EXECUTION',
        'dataState' : '🙄',
        'message' : 'System Error :: Query Execution Failed.',
        'type' : 'ERROR',
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'TRY_AGAIN',
        'dataState' : '🤔',
        'message' : 'System Is Down. Try Again.',
        'type' : 'ERROR',
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'YOU_ARE_LOST',
        'dataState' : '🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣',
        'message' : 'Try Looking For Dinosours.... Blah!',
        'type' : 'ERROR',
        'entity' : 'APP',
        'identifier' : '404'
    },
    {
        'token' : 'SYSTEM_RULE_VIOLATION_ERROR',
        'dataState' : '🤨',
        'message' : 'A System Rule Is Violated.',
        'type' : 'ERROR',
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'PHONE_DIGIT_LENGTH_ERROR',
        'dataState' : '🤨',
        'message' : 'A Bangladeshi Phone Number Should Have 11 Digits With 0 At Starting.',
        'type' : 'ERROR',
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    {
        'token' : 'PHONE_NUMBER_OPERATOR_ERROR',
        'dataState' : '🤨',
        'message' : 'Provided Phone Number Is Not From Any Bangladeshi Operator.',
        'type' : 'ERROR',
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    },
    
    
    







    
    {
        'token' : 'FAULT',
        'dataState' : '🤔🙄🤐😑',
        'message' : 'Immidiately Inform The Backend About Native Response Code Key',
        'type' : 'ERROR',
        'entity' : 'SYSTEM',
        'identifier' : 'Will Be Listed In Once App Is Deployed'
    }

]

exports.messages = messages;