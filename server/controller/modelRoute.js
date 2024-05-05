const { Router } = require('express');
const { classificationModel } = require('../service/phishing_detection_model');

const route = Router();


route.post('/checkURL', async (req, res) => {
    const { url, urlFeatures } = req.body;
    console.log('-- Data Recieved to /checkURL --')
    console.log(url);
    console.log(urlFeatures);
    if (url ==="" || url === null || url === undefined){
        res.send(JSON.stringify({ "error": 1, "msg": "url is null or undefined" }));
        return;
    }
    if (urlFeatures === null || urlFeatures === undefined){
        res.send(JSON.stringify({ "error": 1, "msg": "urlFeatures are null or undefined" }));
        return;
    }

    const urlFeaturesOBJ = JSON.parse(urlFeatures);
    const result = await classificationModel(url, urlFeaturesOBJ);
    console.log('Result from Model: '+ JSON.stringify(result,null,2));
    res.send(JSON.stringify({ "error": 0, "msg": "Operation Succeed", "result": result }));
});




module.exports = route;