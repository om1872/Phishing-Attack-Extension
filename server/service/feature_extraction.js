// const tf = require('@tensorflow/tfjs-node');

function extractFeaturesFromURL(url){
    //hard coded feauture for demo
    return {
        "numdots":3,
        "pathlevel":5,
        "numdash": 0,
        "numsensitivewords":0,
        "pctexthyperlinks":0.000,
        "pctextresourceurls":0.250000,
        "insecureforms":1,
        "pctnullselfredirecthyperlinks":0.0,
        "frequentdomainnamemismatch":0,
        "submitinfotoemail":0,
        "iframeorframe":0
    };
}

module.exports= {extractFeaturesFromURL};