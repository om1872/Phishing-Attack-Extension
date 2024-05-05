//Method to calculate percentage of external resource urls on page
function calculatePctExtResourceUrls() {
    const totalResources = document.querySelectorAll('img, script, link').length;
    if(totalResources === 0)
        return 0;
    const extResources = Array.from(document.querySelectorAll('img[src^="http"], script[src^="http"], link[href^="http"]')).length;
    const pctExtResourceUrls = (extResources / totalResources) * 100;
    return pctExtResourceUrls;
}

// Method to calculate percentage of hyper links which redirect to other external domain
function calculatePctExtHyperLinks() {
    const externalLinks = Array.from(document.querySelectorAll('a')).filter(link => {
        return link.hostname !== window.location.hostname;
    });
    if(document.querySelectorAll('a').length === 0)
        return 0;
    const pctExtHyperlinks = (externalLinks.length / document.querySelectorAll('a').length) * 100;
    return pctExtHyperlinks;
}

// Method to calculate the number of insecure forms
function countNumberOfInsecureForms() {
    const forms = document.querySelectorAll('form');
    if (forms.length === 0)
        return 0;

    const insecureForms = Array.from(forms).filter(form => {
        return form.action.toLowerCase().startsWith('http://');
    });
    return insecureForms.length;
}

//Method to calculate count of iframes and frames
function countIframesAndFrames() {
    const numIframesAndFrames = document.querySelectorAll('iframe').length + document.querySelectorAll('frame').length;;
    return numIframesAndFrames;
}

//Method to count forms which are submitting to email
function countFormsSubmittingToEmail() {
    const emailForms = Array.from(document.querySelectorAll('form')).filter(form => {
        return form.action.toLowerCase().startsWith('mailto:');
    });
    return emailForms.length;
}

//Method to calculate percentage of null or self redirect hyperlinks
function calculatePctNullSelfRedirectHyperlinks() {
    const links = document.querySelectorAll('a[target="_self"]');
    
    if(links.length === 0)
        return 0.00000;

    const totalLinks = links.length;
    let nullTargetLinks = 0;

    links.forEach(link => {
        if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
            nullTargetLinks++;
        }
    });

    const pctNullSelfRedirectHyperlinks = (nullTargetLinks / totalLinks) * 100;
    return pctNullSelfRedirectHyperlinks;
}

//Method which will analyze HTML and calculate required features
function analyzeHTML() {
    const urlFeatures = {
        "pctexthyperlinks": calculatePctExtHyperLinks(),
        "pctextresourceurls":  calculatePctExtResourceUrls(),
        "insecureforms":  countNumberOfInsecureForms(),
        "pctnullselfredirecthyperlinks": calculatePctNullSelfRedirectHyperlinks(),
        "submitinfotoemail": countFormsSubmittingToEmail(),
        "iframeorframe": countIframesAndFrames()
    };
    console.log('Features fetched from tab site DOM:'+ JSON.stringify(urlFeatures));
    return urlFeatures;
}

analyzeHTML();
