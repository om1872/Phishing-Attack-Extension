const getUrlFromBrowser = document.querySelector('#getUrlFromBrowser');
const urlInput = document.querySelector('#urlInput');


document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        urlInput.value = url;
        checkPhishing(url, "check");
    });

    document.getElementById("check-url-form").addEventListener("submit", function (event) {
        event.preventDefault();
        var url = document.getElementById("urlInput").value;
        checkPhishing(url);
    });
});


function getUrlFromBrowserHandler() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        urlInput.value = url;
    });
}


async function checkPhishing(url) {
    // Send request to machine learning API with the URL as the input
    await fetch(`http://127.0.0.1:3000/api/model/checkURL`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "url": JSON.stringify(url) })

    }).then((response) => response.json()).then((data) => {
        // response handle
    }).catch((error) => {
        console.error("Error:", error);
    });
}



getUrlFromBrowser.addEventListener('click', getUrlFromBrowserHandler);