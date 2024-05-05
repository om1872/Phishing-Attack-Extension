'use strict';
const getUrlFromBrowser = document.querySelector('#getUrlFromBrowser');
const urlInput = document.querySelector('#urlInput');
const mainDiv = document.querySelector('.main-div');
const spinner = document.querySelector('.spinner-main');
const spinnerMain = document.querySelector('.spinner-grow');
const resultDiv = document.querySelector('#result');
// import { urlFeatures } from "../contentScript";
let urlFeaturesFromContenScript;
let alertLastCLass;

// An asynchronous method which will inject the content script js file and provide the methods written in it for use in styly.js
async function injectContentScript() {
    // Inject content script programmatically
    var script = document.createElement('script');
    script.src = await chrome.runtime.getURL('contentScript.js');
    script.onload = async function () {
        // Call the function defined in the content script
        var result = analyzeHTML();
        urlFeaturesFromContenScript = result;
    };
    (document.head || document.documentElement).appendChild(script);
}

//An event listener on document of Extension which will fetch url from current tab and add an event on form which checks the urls.
document.addEventListener("DOMContentLoaded", async function () {
    await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        urlInput.value = url;
        // checkPhishing(url);
    });

    document.getElementById("check-url-form").addEventListener("submit", function (event) {
        event.preventDefault();
        var url = document.getElementById("urlInput").value;
        checkPhishing(url);
    });
});

//Method to get URL from Browser
async function getUrlFromBrowserHandler() {
    await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        urlInput.value = url;
    });
}

//Method which will invoke AnalyzeHTML() from content script js file
async function getURLFeaturesFromDom() {
    return await injectContentScript();
}

function waitStatusDisableOnUI(){
    spinner.classList.add('spinner-deactivate');
    spinner.classList.add('spinner-deactivate');
    mainDiv.classList.remove('spinner-deactivate');
}

function waitStatusEnableOnUI(){
    mainDiv.classList.add('spinner-deactivate');
    spinner.classList.remove('spinner-deactivate');
    spinnerMain.classList.remove('spinner-deactivate');
}

//This Method will call to server with some features and the url
async function checkPhishing(url) {
    await getURLFeaturesFromDom();
    const urlFeatures = urlFeaturesFromContenScript;

    if (urlFeatures === null || urlFeatures === undefined) {
        //User prompt to wait or retry
    } else {
        waitStatusEnableOnUI();
        // Send request to machine learning API with the URL as the input
        await fetch(`http://127.0.0.1:3000/api/model/checkURL`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "url": JSON.stringify(url),
                "urlFeatures": JSON.stringify(urlFeatures)
            })

        }).then((response) => response.json()).then((data) => {
            // response handle
            console.log(data);
            if (data["error"] === 0){
                resultDiv.classList.remove(alertLastCLass);
                resultDiv.classList.add('alert-success');
                alertLastCLass = 'alert-success';
                document.querySelector('.result-msg').innerHTML = JSON.stringify(data["result"]);
                
            } else {
                resultDiv.classList.remove(alertLastCLass);
                resultDiv.classList.add('alert-warning');
                alertLastCLass = 'alert-warning';
                document.querySelector('.result-msg').innerHTML = JSON.stringify(data["msg"]);
            }

            waitStatusDisableOnUI();
        }).catch((error) => {
            //Error handle
            console.error("Error:", error);
            resultDiv.classList.remove(alertLastCLass);
            resultDiv.classList.add('alert-danger');
            alertLastCLass = 'alert-danger';
            document.querySelector('.result-msg').innerHTML = error;
            waitStatusDisableOnUI();
        });

    }
}

//Event listener on chrome icon element which will fetch url from browser
getUrlFromBrowser.addEventListener('click', getUrlFromBrowserHandler);