const importCsvRoute = require('./importCsv');
const dashboardRoute = require('./dashboard');
const router = require('express').Router();

router.use(importCsvRoute);
router.use(dashboardRoute);
router.use('/seeds', dashboardRoute);

module.exports = router;