const express = require("express");
const path = require("path");
const morgan = require("morgan");
// const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.set("port", process.env.PORT || 3001);


app.use(morgan('dev'));
app.use(express.json(),(req,res));
app.use(express.urlencoded({ extended: false }));


//define router
const authRouter = require('./Routes/authRouter');
const driveRouter = require('./Routes/driveRouter');
const fileRouter = require('./Routes/fileRouter');
const takeOutRouter = require('./Routes/takeOutRouter');
//register router
app.use('/auth', authRouter);
app.use('/drive', driveRouter);
app.use('/file', fileRouter);
app.use('/takeout',takeOutRouter);

// error handler middleware
app.use(function(err, req, res, next) {
    // Do logging and user-friendly error message display
    console.error(err.stack);
    const status = err.status;
    const response = {
        success : false,
        message : err.message
    }
    res.status(status || 500).send(response);
});


app.listen(app.get('port'),()=>{
    console.log('listeing on port ', app.get('port'));
})


