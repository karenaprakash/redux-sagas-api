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

const adminRouter = require('./Router/admin');
app.use('/api/admin',adminRouter);

app.listen(3030,()=>{
    console.log('Server is running on 3030')
})