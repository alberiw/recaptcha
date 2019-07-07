const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

const captchaSecret = '';
const captchaUrl = (response, remoteip) => `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${response}&remoteip=${remoteip}`

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
    if (req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.status(400).json({});
    }

    axios
        .post(captchaUrl(req.body.captcha, req.connection.remoteAddress), {})
        .then(e => {
            res.status(e.data.success ? 200 : 400).json({
                status: e.status,
                body: e.data
            });
        })
        .catch(e => {
            res.status(500).json({
                status: e.status,
                body: e.body
            });
        });

});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));