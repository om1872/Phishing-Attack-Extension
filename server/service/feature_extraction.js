// const tf = require('@tensorflow/tfjs-node');

function getNumDots(url) {
    return 3;
}

function getPathLevel(url) {
    return 5;
}

function getNumDash(url) {
    return 0;
}

function getNumSensitiveWords(url) {
    return 0;
}

function getPctExtHyperLinks(url) {
    return 0.000;
}

function getPctExtResourceUrls(url) {
    return 0.250000;
}

function getInsecureForms(url) {
    return 1;
}

function getPctNullSelfRedirectHyperLinks(url) {
    return 0.0;
}

function getFrequentDomainNameMismatch(url) {
    return 0;
}

function getSumbitInfoToEmail(url) {
    return 0;
}

function getIframeOrFrame(url) {
    return 0;
}

function extractFeaturesFromURL(url) {
    //hard coded feauture for demo
    return {
        "numdots": getNumDots(url),
        "pathlevel": getPathLevel(url),
        "numdash": getNumDash(url),
        "numsensitivewords": getNumSensitiveWords(url),
        "pctexthyperlinks": getPctExtHyperLinks(url),
        "pctextresourceurls": getPctExtResourceUrls(url),
        "insecureforms": getInsecureForms(url),
        "pctnullselfredirecthyperlinks": getPctNullSelfRedirectHyperLinks(url),
        "frequentdomainnamemismatch": getFrequentDomainNameMismatch(url),
        "submitinfotoemail": getSumbitInfoToEmail(url),
        "iframeorframe": getIframeOrFrame(url)
    };
}

module.exports = { extractFeaturesFromURL };