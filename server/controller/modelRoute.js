const { Router } = require('express');
const {classificationModel} = require('../service/phishing_detection_model');

const route = Router();


route.post('/checkURL', async (req, res) => {
    const {url} = req.body;
    console.log(url);

    const result = await classificationModel(url);
    console.log(result);
    return result;
});




module.exports = route;