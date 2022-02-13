const express = require("express");
const path = require("path");
const morgan = require("morgan");
// const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(morgan('dev'));
app.set("port", process.env.PORT || 3001);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//define router
const authRouter= require(path.join(__dirname,'./Routes/authRouter'));
const driveRouter= require(path.join(__dirname,'./Routes/driveRouter'));

app.use('/auth', authRouter);
app.use('/drive', driveRouter);

// error handler middleware
app.use(function(err, req, res, next) {
    // Do logging and user-friendly error message display
    console.error(err.stack);
    const status = err.status;
    const response = {
        success : false,
        message : err.message
    }
    res.status(status | 500).send(response);
});


app.listen(app.get('port'),()=>{
    console.log('listeing on port ', app.get('port'));
})


