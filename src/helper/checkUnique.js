const { query } = require('../db');
const checkAllUnique = async (table, fieldMain, dataCompare, fieldCompare) => {
    const dataCompareIdOnly = setDataToArray1D(dataCompare, fieldMain);
    const sql = `SELECT ${fieldCompare} FROM ${table} WHERE ${fieldCompare} IN (${dataCompareIdOnly.join(',')})`;
    const rows = await query(sql);
    const checkEquals = checkDataUpdateOrInsert(dataCompare, rows, fieldMain, fieldCompare);
    return checkEquals;
}

const checkDataUpdateOrInsert = (mainArray, compareArray, fieldMain, fieldCompare) => {
    let updateData = [],
        insertData = [];
    for(let i = 0; i < mainArray.length; i++){
        let value = mainArray[i]
        let isEqual = false
        for(let x = 0; x < compareArray.length; x++){
            let value2 = compareArray[x]
            if(value[fieldMain] == value2[fieldCompare]){
                isEqual = true
                updateData.push(value)
                break;
            }
        }
        if(isEqual == false){
            insertData.push(value)
        }
    }

    return {updateData: updateData, insertData: insertData};
}

function compareArray(mainArray, compareArray, fieldMain, fieldCompare) {

    compareArray = setDataToArray1D(compareArray, fieldCompare);


    let returnData = {
        isEqual: true,
        currentArray: mainArray,
        equalOnly: [],
        notEqualOnly: [],
    };
    let groupArray1 = [],
        groupArray2 = [],
        successArray1 = [],
        successArray2 = [],
        equalOnly = [],
        removeEqual = [];

    // group array
    for (let i = 0; i < mainArray.length; i++) {
        groupArray1[mainArray[i]] = mainArray[i];
    }
    // เรียงใหม่เริ่ม index 0
    let index = 0;
    for (var key in groupArray1) {
        successArray1[index] = groupArray1[key];
        index++;
    }
    // group array
    for (let i = 0; i < compareArray.length; i++) {
        groupArray2[compareArray[i]] = compareArray[i];
    }
    // เรียงใหม่เริ่ม index 0
    index = 0;
    for (var key in groupArray2) {
        successArray2[index] = groupArray2[key];
        index++;
    }

    removeEqual = successArray1;
    for (let i = 0; i < successArray1.length; i++) {
        for (let x = 0; x < successArray2.length; x++) {
            if (successArray1[i] == successArray2[x]) {
                equalOnly.push(successArray1[i]);
                successArray2.splice(x, 1);
                break;
            };
        }
    }
    removeEqual = successArray2;
    returnData.equalOnly = equalOnly;
    returnData.notEqualOnly = removeEqual;
    return returnData;
}

function setDataToArray1D(array2D, field) {
    let returnData = [];
    for (let i = 0; i < array2D.length; i++) {
        if (array2D[i] instanceof Array || array2D[i] instanceof Object) {
            returnData.push(array2D[i][field]);
        }
    }
    return returnData;
}

module.exports = checkAllUnique;