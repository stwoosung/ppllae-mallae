const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')



const app = express()
const port = 3000

app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, './public')));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, `./public`, 'index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})