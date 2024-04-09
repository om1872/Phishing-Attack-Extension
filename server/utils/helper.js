
async function fetchData(url) {
    return await fetch(url).then(res => res.json())
        .then(json => {
            return json;
        }).catch(err => 'Error: ' + console.error(err))
}


module.exports={fetchData};