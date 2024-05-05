const url = require('node:url');
const {phishingWordlist} = require('../utils/wordlist');
const { frequentDomainNameList } = require('../utils/frequentDomainList');

function getNumDots(url) {
    let count = 0;
    for (let i = 0; i < url.length; i++) {
        if (url[i] === '.')
            count++;
    }
    return count;
}

function getPathLevel(urlPath) {
    return urlPath.split('/').length - 1;
}

function getNumDash(url) {
    let count = 0;
    for (let i = 0; i < url.length; i++) {
        if (url[i] === '-')
            count++;
    }
    return count;
}

function getNumSensitiveWords(host, pathname, search, hash) {
    let count=0;
    phishingWordlist.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        if(host.match(regex)){
            count++;
        }
    })
    phishingWordlist.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        if(pathname.match(regex)){
            count++;
        }
    })
    phishingWordlist.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        if(search.match(regex)){
            count++;
        }
    })
    phishingWordlist.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        if(host.match(regex)){
            count++;
            return;
        }
    })

    return count;
}

function getFrequentDomainNameMismatch(domain) {
    // console.log(domain);
    let check = true;
    frequentDomainNameList.forEach(domainFromList => {
        if(domain.match(domainFromList)){
            check = false;
        }
    });
    return check?1:0;
}


function extractFeaturesFromURL(inputUrl, urlFeatures) {
    if (inputUrl.length && inputUrl != null && inputUrl != undefined) {
        const myUrl = new url.URL({ toString: () => JSON.parse(inputUrl) });
        console.log('-- URL Information --')
        console.log(myUrl);
        return {
            "numdots": getNumDots(JSON.parse(inputUrl)),
            "pathlevel": getPathLevel(myUrl.pathname),
            "numdash": getNumDash(JSON.parse(inputUrl)),
            "numsensitivewords": getNumSensitiveWords(myUrl.host, myUrl.pathname, myUrl.search, myUrl.hash),
            "pctexthyperlinks": urlFeatures["pctexthyperlinks"], 
            "pctextresourceurls": urlFeatures["pctextresourceurls"], 
            "insecureforms": urlFeatures["insecureforms"], 
            "pctnullselfredirecthyperlinks": urlFeatures["pctnullselfredirecthyperlinks"], 
            "frequentdomainnamemismatch": getFrequentDomainNameMismatch(myUrl.host),
            "submitinfotoemail": urlFeatures["submitinfotoemail"], 
            "iframeorframe": urlFeatures["iframeorframe"]
        };
    }
}

module.exports = { extractFeaturesFromURL };