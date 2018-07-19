var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');

var app = express();

app.listen(3000, () => {
    console.log('server started');
});