const tf = require('@tensorflow/tfjs');
const { extractFeaturesFromURL } = require('./feature_extraction');


const puppeteer = require('puppeteer');

async function callModelServerAndPredict(inputs) {
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('http://localhost:5500/index.html', {
    waitUntil: 'networkidle0'
  });

  // Create a mock function (evaluate will replace this with the actual function)
  const tfdfPredict = (inputs) => { };

  // Call the predict function inside the page
  const result = await page.evaluate((inputs) => {
    return tfdfPredict(inputs);
  }, inputs);

  return result;
};


async function classificationModel(url,urlFeatures) {
  const input = await extractFeaturesFromURL(url,urlFeatures);
  console.log('Final Inputs to Model From Server: '+ JSON.stringify(input,null,2));
  const result = await callModelServerAndPredict(input);
  console.log('Waiting for output from Model ...');
  return result;
}


module.exports = { classificationModel };