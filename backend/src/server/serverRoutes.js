const express = require('express');
const locationRoutes = require('../domain/location')




const router = express.Router();
router.use('/location', locationRoutes);





module.exports = router;