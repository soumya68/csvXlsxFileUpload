const removeEmpty = (obj) => {
    Object.keys(obj).forEach(k =>
        (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
        (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
};
const message = [
    { "code": 400, "txt": "Invalid request" },
    { "code": 406, "txt": "Invalid Account data" },
    { "code": 401, "txt": "Incorrect credentials" },
    { "code": 403, "txt": "Account unauthorized" },
    { "code": 500, "txt": "Server error" },
    { "code": 201, "txt": "Successfully created" },
    { "code": 409, "txt": "Account already exists" },
    { "code": 202, "txt": "Accepted" },
    { "code": 404, "txt": "Record not found" },
    { "code": 423, "txt": "Account is locked" },
    { "code": 200, "txt": "Success" },
    { "code": 204, "txt": "No content" }
];
const responseMsg = (code = 500, data = null, success = false, token = null) => {
    console.log(code, data, success, token)
    let msg = "";
    msg = message.find(item => item.code == code).txt;
    if (data) {
        if (data.message) {
            msg = data.message;
            data = null;
        }
    }
    return removeEmpty({ code, msg, data, success, token });
};
const sendRemainingLoginAttempts = (code, attempts) => {
    msg = message.find(item => item.code == code).txt;
    return { code: code, message: `${msg} ${attempts} attempts remaining` }
}
module.exports = {
    removeEmpty,
    responseMsg,
    sendRemainingLoginAttempts
};