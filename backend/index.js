const express = require("express");
const cors = require('cors')
const rootRouter = require('./routes/index')
const jwt = require('jsonwebtoken')
const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/v1', rootRouter);


const port = 3000;
app.listen(port, ()=>{
    console.log(`listening at port ${port}`)
})
