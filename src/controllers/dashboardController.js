const controller = {},
        { db } = require('../db'),
        {getAllSeeds} = require('./importCsvController');
controller.dashboard = (req, res) => {
    res.render('dashboard');
};

controller.getAllSeedsData = async (req, res) =>{
    const rows = await getAllSeeds();
    let status = false;
    if(rows.length > 0){
        status = true;
    }
    res.end(JSON.stringify({status: status, items: rows})); 
}
 
module.exports = controller;