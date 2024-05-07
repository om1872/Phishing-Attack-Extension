
//Method to calculate percentage of external resource urls on page
function calculatePctExtResourceUrls() {
    const totalResources = document.querySelectorAll('img, script, link, object, iframe').length;
    if (totalResources === 0)
        return 0;
    const extResources = Array.from(document.querySelectorAll('img[src^="http"], script[src^="http"], link[href^="http"] , object[data^="http"], iframe[src^="http"]')).length;
    console.log(extResources,totalResources)
    const pctExtResourceUrls = (extResources / totalResources) * 100;
    return pctExtResourceUrls*1.00000;
}

// Method to calculate percentage of hyper links which redirect to other external domain
function calculatePctExtHyperLinks() {
    const localhost = window.location.hostname;
    const externalLinks = Array.from(document.querySelectorAll('a')).filter(link => {
        if(link === undefined || link === null || link.hostname === undefined || link.hostname === null){
            return false;
        }
        return link.hostname != localhost;
    });
    if (document.querySelectorAll('a').length === 0)
        return 0;
    const pctExtHyperlinks = (externalLinks.length / document.querySelectorAll('a').length) * 100;
    return pctExtHyperlinks*1.00000;
}

// Method to calculate the number of insecure forms
function isInsecureFormsPresent() {
    const forms = document.querySelectorAll('form');
    if (forms.length === 0)
        return 0;

    const insecureForms = Array.from(forms).filter(form => {
        return form.action.toLowerCase().startsWith('http://');
    });
    return insecureForms.length === 0 ? 0 : 1;
}

//Method to calculate count of iframes and frames
function isIframesAndFramesPresent() {
    const numIframesAndFrames = document.querySelectorAll('iframe').length + document.querySelectorAll('frame').length;;
    return numIframesAndFrames === 0 ? 0: 1;
}

//Method to count forms which are submitting to email
function isFormsSubmittingToEmailPresent() {
    const emailForms = Array.from(document.querySelectorAll('form')).filter(form => {
        return form.action.toLowerCase().startsWith('mailto:');
    });
    return emailForms.length === 0 ? 0 : 1;
}

//Method to calculate percentage of null or self redirect hyperlinks
function calculatePctNullSelfRedirectHyperlinks() {
    const totalLinks = Array.from(document.querySelectorAll('a'));
    let links = [];
    totalLinks.forEach(function(link) {
        // Check if the href attribute is null or a self-redirecting link
        if (link.getAttribute('href') === null || link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:void(0)') {
            // Do something with the null or self-redirect link
            links.push(link);
        }
    });
    if(totalLinks === 0)
        return 0.00000;
    const pctNullSelfRedirectHyperlinks = (links.length / totalLinks.length) * 100;
    return pctNullSelfRedirectHyperlinks;
}

//Method which will analyze HTML and calculate required features
function analyzeHTML() {
    const urlFeatures = {
        "pctexthyperlinks": calculatePctExtHyperLinks(),
        "pctextresourceurls": calculatePctExtResourceUrls(),
        "insecureforms": isInsecureFormsPresent(),
        "pctnullselfredirecthyperlinks": calculatePctNullSelfRedirectHyperlinks(),
        "submitinfotoemail": isFormsSubmittingToEmailPresent(),
        "iframeorframe": isIframesAndFramesPresent()
    };
    console.log('Features fetched from tab site DOM:' + JSON.stringify(urlFeatures));
    return urlFeatures;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Request From:',request);
    let domFeatures = analyzeHTML(); 
    console.log(domFeatures);
    sendResponse(JSON.stringify(domFeatures));
})


