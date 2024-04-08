const getUrlFromBrowser = document.querySelector('#getUrlFromBrowser');
const urlInput = document.querySelector('#urlInput');


document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        urlInput.value = url;
        checkPhishing(url, "check");
    });

    document
        .getElementById("check-url-form")
        .addEventListener("submit", function (event) {
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


function checkPhishing(url) {
    // Send request to machine learning API with the URL as the input
    alert(url);
    fetch(`http://127.0.0.1:3000/api?url=${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {

        })
        .catch((error) => {
            console.error("Error:", error);
        });
}



getUrlFromBrowser.addEventListener('click', getUrlFromBrowserHandler);