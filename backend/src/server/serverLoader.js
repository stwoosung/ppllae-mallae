const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const apiRoutes = require('./serverRoutes');


const app = express();



app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false, }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));  

app.use('/api', apiRoutes);

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});