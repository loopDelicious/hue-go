### Proxy public requests to Hue Light on your local network. 

If you don't want public requests sent directly to a Hue light on your local network, accept these requests to a server running on your local network to handle rate limiting and input validation.

Read the [Hue Lights API documentation](https://developers.meethue.com/develop/hue-api/lights-api/).

### For configuration

Optional environment variables to set
- `HUE_IP`
- `HUE_USER`
- `PORT`
- `REDIS_HOST`
- `REDIS_PORT`

### For local development

Install dependencies and start local server

    $ npm install
    $ npm run server

Start local redis

    $ redis-server

Open redis cli

    $ redis-cli

### For deployment

TBD
    