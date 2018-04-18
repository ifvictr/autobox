const axios = require("axios");
const cookie = require("cookie");
const qs = require("qs");
const utils = require("./utils");

const USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36";

const BASE_URL = "https://www.nitrotype.com/api";
const LOGIN_URL = `${BASE_URL}/login`;
const REWARD_URL = `${BASE_URL}/rewards/daily`;

exports.handler = async (event, context) => {
    const data = {
        username: process.env.NT_USERNAME,
        password: process.env.NT_PASSWORD,
        adb: 1,
        tz: "America/Los_Angeles"
    };
    let cookies = [];
    let userHash;

    try {
        const initialRes = await axios.post(LOGIN_URL, qs.stringify(data), {
            headers: {
                "User-Agent": USER_AGENT
            }
        });
        // Prepare cookies for claim request
        cookies = initialRes.headers["set-cookie"].map(str => {
            let cookieObj = cookie.parse(str);
            const firstProp = Object.keys(cookieObj)[0]; // Get cookie name
            cookieObj.name = firstProp;
            cookieObj.value = cookieObj[firstProp];
            delete cookieObj[firstProp]; // Clean up before saving
            return cookieObj;
        });
        userHash = cookies.find(cookie => cookie.name === "ntuserrem").value;

        const claimRes = await axios.get(`${REWARD_URL}?uhash=${userHash}`, {
            headers: {
                "Cookie": utils.stringifyCookies(cookies),
                "User-Agent": USER_AGENT
            }
        });
        return claimRes.data;
    }
    catch(e) {
        return e;
    }
};