const express = require('express')
const app = express()
const port = 3001
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const utilities = require('./utilities')
const request = require('request-promise-native')
const hueIP = process.env.HUE_IP || '192.168.1.80'
const hueUser = process.env.HUE_USER

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', async (req, res) => {
    let ip = req.ip
    let overLimit = await utilities.isOverLimit(ip)
    if (overLimit) {
        res.status(429).send('Too many requests - try again later')
        return
    }
    // TODO: return time remaining
    // TOOD: validate lightID
    let status = req.body.on || false
    let sat = req.body.sat || 254
    let bri = req.body.bri || 254
    let hue = req.body.hue || 30000
    let hueLightID = req.body.lightID || 4

    let hueRes
    try {
        hueRes = await request(`http://${hueIP}/api/${hueUser}/lights/${hueLightID}/state`, {
            method: "PUT",
            json: true,
            body: {
                on: status,
                sat: sat,
                bri: bri,
                hue: hue
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