const { Router } = require('express');
const {extractFeaturesFromURL} = require('../service/feature_extraction');
const {classificationModel} = require('../service/phishing_detection_model');

const route = Router();


route.post('/checkURL', async (req, res) => {
    const {url} = req.body;
    const featuresListFromURL = extractFeaturesFromURL(url);

});




module.exports = route;