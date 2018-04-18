const cookie = require("cookie");

exports.stringifyCookies = arr => arr.reduce((str, curr) => `${str}${cookie.serialize(curr.name, curr.value)}; `, "");