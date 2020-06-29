const express = require('express')
const app = express()
const utilities = require('./utilities')
const request = require('request-promise-native')
const port = process.env.PORT || 3001
const hueIP = process.env.HUE_IP || '192.168.1.80'
const hueUser = process.env.HUE_USER || 'T4O8humbfa7kVW2uGAYHyvimLcWP7lnHlDOe-8Sh'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', async (req, res) => {

    // check rate limit
    let overLimit = await utilities.isOverLimit(req.ip)
    if (overLimit) {
        res.status(429).send('Too many requests - try again later')
        return
    }

    // check ON/OFF input
    if (!['undefined', 'boolean'].includes(typeof req.body.on)) {
        res.status(400).send("Input true or false for `on` property")
        return
    }

    // check saturation input
    if (req.body.hasOwnProperty("sat")) {
        if (!(Number.isInteger(req.body.sat) && (0 < req.body.sat < 284))) {
            res.status(400).send('Valid saturation required')
            return
        }
    }

    // check brightness input 
    if (req.body.hasOwnProperty("bri")) {
        if (!(Number.isInteger(req.body.bri) && (0 < req.body.bri < 284))) {
            res.status(400).send('Valid brightness required')
            return
        }
    }

    // check hue input
    if (req.body.hasOwnProperty("hue")) {
        console.log('huey')
        if (!(Number.isInteger(req.body.hue) && (0 < req.body.hue < 60000))) {
            res.status(400).send('Valid hue required')
            return
        }
    }

    let hueLightID = 4
    let hueRes
    try {
        hueRes = await request(`http://${hueIP}/api/${hueUser}/lights/${hueLightID}/state`, {
            method: "PUT",
            json: true,
            body: {
                on: req.body.on || false,
                sat: req.body.sat || 254,
                bri: req.body.bri || 254,
                hue: req.body.hue || 30000
            }
        })
    } catch (err) {
        console.error('Call to Hue failed: ', err)
        res.status(502).send('Call to Hue failed - try again later')
        return
    }
    console.log(hueRes)
    res.send('OK')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))