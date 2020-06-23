const redis = require('ioredis')

const client = redis.createClient({
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
})

client.on('connect', function () {
    console.log('connected');
});

module.exports = {
    isOverLimit: async function (ip) {
        let res
        try {
            res = await client.incr(ip)
        } catch (err) {
            console.error('isOverLimit: could not increment key')
            throw err
        }

        console.log(`${ip} has value: ${res}`)

        if (res > 10) {
            return true
        }
        client.expire(ip, 10)
    },

    notValidStatus: function (on) {
        if (typeof (on) === "boolean") {
            return false
        } else {
            return true
        }
    },

    notValidBriOrSat: function (bri) {
        if (Number.isInteger(bri) && 0 < bri < 284) {
            return false
        } else {
            return true
        }
    },

    notValidHue: function (hue) {
        if (Number.isInteger(hue) && 0 < hue < 60000) {
            return false
        } else {
            return true
        }
    }

}