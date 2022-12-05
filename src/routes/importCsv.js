const router = require('express').Router(),
    multer = require('multer'),
    path = require('path'),
    csv = require('fast-csv'),
    importCsvController = require('../controllers/importCsvController');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
});

router.get('/import-csv', importCsvController.import);
router.post('/import-csv', upload.single("import-csv"), importCsvController.importCsv);
// router.post('/import-csv', usersMiddleware.checkRegisterCount,customerController.save);
// router.get('/update/:id', customerController.edit);
// router.post('/update/:id', customerController.update);
// router.get('/delete/:id', customerController.delete);

module.exports = router;

