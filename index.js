const nitrotype = require('nitrotype')

exports.handler = async () => {
    try {
        const client = nitrotype({
            username: process.env.NT_USERNAME,
            password: process.env.NT_PASSWORD
        })
        await client.login()
        const res = await client.get('rewards/daily')
        console.log(res)
    }
    catch (e) {
        console.log(e)
    }
}