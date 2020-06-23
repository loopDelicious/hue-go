const express = require('express')
const app = express()
const utilities = require('./utilities')
const request = require('request-promise-native')
const port = process.env.PORT || 3001
const hueIP = process.env.HUE_IP || '192.168.1.80'
const hueUser = process.env.HUE_USER ||

    app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', async (req, res) => {

    // check rate limit
    let ip = req.ip
    let overLimit = await utilities.isOverLimit(ip)
    if (overLimit) {
        res.status(429).send('Too many requests - try again later')
        return
    }

    // check ON/OFF input
    let invalidStatus = await utilities.notValidStatus(req.body.on)
    if (invalidStatus) {
        res.status(422).send("Input true or false for `on` property")
        return
    }

    // check saturation input
    let invalidSaturation = await utilities.notValidBriOrSat(req.body.sat)
    if (invalidSaturation) {
        res.status(422).send('Valid saturation required')
        return
    }

    // check brightness input 
    let invalidBrightness = await utilities.notValidBriOrSat(req.body.bri)
    if (invalidBrightness) {
        res.status(422).send('Valid brightness required')
        return
    }

    // check hue input
    let invalidHue = await utilities.notValidHue(req.body.hue)
    if (invalidHue) {
        res.status(422).send('Valid hue required')
        return
    }

    let hueLightID = 4
    let hueRes
    try {
        hueRes = await request(`http://${hueIP}/api/${hueUser}/lights/${hueLightID}/state`, {
            method: "PUT",
            json: true,
            body: {
                on: !invalidStatus ? req.body.on : false,
                sat: !invalidSaturation ? req.body.sat : 284,
                bri: !invalidBrightness ? req.body.bri : 284,
                hue: !invalidHue ? req.body.hue : 30000
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