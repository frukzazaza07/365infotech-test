
const controller = {},
    csv = require('fast-csv'),
    fs = require('fs'),
    { db } = require('../db'),
    returnData = { status: true, message: [] },
    { checkAllUnique, excelToArray } = require('../helper/index');
async function uploadCsvToDb(uriFile) {
    let csvDataColl = await excelToArray(uriFile);
    return new Promise(async (resolve) => {
        if (csvDataColl.length == 0) resolve(false);
        const { updateData, insertData } = await checkAllUnique('tbl_seeds', '0', csvDataColl, 'excel_id');
        const column = [
            'excel_id',
            'seed_rep_date',
            'seed_year',
            'seeds_year_week',
            'seed_varity',
            'seed_RDCSD',
            'seed_stock_to_sale',
            'seed_season',
            'seed_crop_year'
        ];
        const query = `INSERT INTO tbl_seeds (${column.join(',')}) VALUES ?`;

        if (updateData.length > 0) {
            const sql = `UPDATE tbl_seeds SET seed_stock_to_sale = seed_stock_to_sale + ? WHERE excel_id = ?`;
            for (let i = 0; i < updateData.length; i++) {
                let value = updateData[i];
                const message = await controller.updateById([value[6], value[0]], `Update failed id: ${value[0]}`, `Update id: ${value[0]} successfully`);
                returnData.message.push(message)
            }

        }

        if (insertData.length > 0) {
            db.query(query, [insertData], (err) => {
                if (err) {
                    console.error('err from callback: ' + err.stack)
                    returnData.status = false;
                };
                resolve(returnData);
            });
        }
        resolve(returnData);

    })

}

controller.updateById = async (data, messageFailed, messageSuccess) => {
    const sql = `UPDATE tbl_seeds SET seed_stock_to_sale = seed_stock_to_sale + ? WHERE excel_id = ?`;
    return new Promise((resolve) => {
        db.query(sql, data, (err) => {
            let message = "";
            if (err) {
                console.error('err from callback: ' + err.stack)
                message = messageFailed;
            } else {
                message = messageSuccess;
            }
            resolve(message)
        });
    })
}

controller.getAllSeeds = async () => {
    const sql = `SELECT * FROM tbl_seeds`;
    return new Promise((resolve) => {
        db.query(sql, (err, rows) => {
            let data = [];
            if (err) {
                console.error('err from callback: ' + err.stack)
            } 
            if (rows.length > 0){
                data = rows;
            }
            resolve(data)
        });
    })
}

controller.import = (req, res) => {
    res.render('import_csv');
};

controller.importCsv = async (req, res, next) => {
    // ถ้าซ้ำเป็น update stock?
    const uploadStatus = await uploadCsvToDb('./uploads/' + req.file.filename);
    console.log(uploadStatus)
    let returnData = { class: 'success', message: 'Import seeds successfully' };
    if (uploadStatus.status == false) {
        returnData.class = 'danger';
        returnData.message = 'Import seeds failed';
    }
    req.flash(returnData.class, returnData.message);
    res.redirect('/import-csv');


};


module.exports = controller;
