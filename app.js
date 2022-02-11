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