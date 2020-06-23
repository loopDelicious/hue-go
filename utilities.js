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


    }
}