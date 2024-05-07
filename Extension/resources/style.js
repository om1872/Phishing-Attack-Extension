'use strict';
const getUrlFromBrowser = document.querySelector('#getUrlFromBrowser');
const urlInput = document.querySelector('#urlInput');
const mainDiv = document.querySelector('.main-div');
const spinner = document.querySelector('.spinner-main');
const spinnerMain = document.querySelector('.spinner-grow');
const resultDiv = document.querySelector('#result');

let urlFeaturesFromContenScript;
let alertLastCLass;


async function injectContentScript() {
    await chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        await chrome.tabs.sendMessage(tabs[0].id, { data: "getDom" }, (response) => {
            if (response === undefined) {
                resultDiv.classList.remove(alertLastCLass);
                resultDiv.classList.add('alert-warning');
                alertLastCLass = 'alert-warning';
                document.querySelector('.result-msg').innerHTML = "Failed to calculate DOM features, Plz Try Again!!";
            } else {
                urlFeaturesFromContenScript = JSON.parse(response);
            }
        });
    })
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

//Spinner Disable 
function waitStatusDisableOnUI() {
    spinner.classList.add('spinner-deactivate');
    spinner.classList.add('spinner-deactivate');
    mainDiv.classList.remove('spinner-deactivate');
}

//Spinner enable
function waitStatusEnableOnUI() {
    mainDiv.classList.add('spinner-deactivate');
    spinner.classList.remove('spinner-deactivate');
    spinnerMain.classList.remove('spinner-deactivate');
}

//Storing url data in local storage
function storeResultInLocal(url,result){
    const date = new Date().toISOString().slice(0, 10).split('-').reverse().join('/');
    localStorage.setItem(url,JSON.stringify({"date":date,"result":result}));
    console.log(localStorage.getItem(url));
}

//Fetching all result from local storage
function getAllFromLocalStorage() {
    var values = [], keys = Object.keys(localStorage), i = keys.length;
    while ( i-- ) {
        const data = JSON.parse(localStorage.getItem(keys[i]));
        values.push( {"date":data["date"],"url":keys[i],"result":data["result"]});
    }
    return values;
}

//This method will be invoked when download report button is hit and it will generate table and save it in pdf format
function download(){
    const { jsPDF } = window.jspdf;
    const dateToday = new Date();
    const data = getAllFromLocalStorage();
    var doc = new jsPDF();
    var col = ["No.","Date","URL","Severity"];
    var row = [];
    let i=1;
    data.forEach(data => {
        row.push([i,data.date,data.url,`${data.result}%`]);
        i++;
    })
    doc.autoTable(col, row, { startY: 10 });
    doc.save(`Report-${dateToday.toLocaleDateString('en-GB')}.pdf`);
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
            if (data["error"] === 0) {
                resultDiv.classList.remove(alertLastCLass);

                let result = data["result"]["0"];
                result = result.toFixed(2) * 100;
                if (result <= 30) {
                    resultDiv.classList.add('alert-success');
                    alertLastCLass = 'alert-success';
                    document.querySelector('.result-msg').innerHTML = `Safe to Visit 🙂`;
                } else if( result >30 && result <=60) {
                    resultDiv.classList.add('alert-warning');
                    alertLastCLass = 'alert-warning';
                    document.querySelector('.result-msg').innerHTML = `Good to go 👍`;
                } else if (result >60 && result <=80) {
                    resultDiv.classList.add('alert-critical');
                    alertLastCLass = 'alert-critical';
                    document.querySelector('.result-msg').innerHTML = `Be Aware might be risky 😬`;
                } else {
                    resultDiv.classList.add('alert-danger');
                    alertLastCLass = 'alert-danger';
                    document.querySelector('.result-msg').innerHTML = `Danger !!! ☠️`;
                }

                storeResultInLocal(url,result);
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

document.querySelector('#downloadReport').addEventListener('click',download);