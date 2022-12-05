const   csv = require('fast-csv'),
        fs = require('fs');
const excelToArray = async (pathFile) => {
    let stream = fs.createReadStream(pathFile);
    let csvDataColl = [];
    return new Promise((resolve) => {
        let fileStream = csv
            .parse()
            .on("data", function (data) {
                csvDataColl.push(data);
            })
            .on("end", async () => {
                csvDataColl.shift();
                resolve(csvDataColl);
            });

        stream.pipe(fileStream);

    })
}

module.exports = {excelToArray};