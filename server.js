const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./Config/config').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
const mailSender = require('./Middlewares/mailSender');
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials : true  
}
app.use(cors(corsOptions));

//mailSender()

const userRouter = require('./Router/user');
app.use('/api',userRouter);

app.use((err,req,res,next) => {
    res.status(400)
    .json({
        message: err
    })
})

app.listen(3030,()=>{
    console.log('Server is running on 3030')
})