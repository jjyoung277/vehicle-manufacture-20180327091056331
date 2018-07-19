var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');

var _storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: _storage});

var app = express();
app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/upload', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('userfile'), (req, res) => {
    console.log(req.file);
    res.send('uploaded' + req.file);
});

app.get('/topic/new', (req, res) => {
    fs.readdir('data/', (err, files) => {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new', {_files: files});
    });
});

app.get(['/topic', '/topic/:id'], (req, res) => {
    fs.readdir('data/', (err, files) => {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var fileName = req.params.id;
        if(fileName) {
            fs.readFile('data/'+fileName, 'utf8', (err, data) => {
                if(err) {
                    console.log(err);
                    res.status(500).send('File not exists');
                }
                res.render('view', {_fileName: fileName, _files: files, _fileContent: data});
            });
        }
        else {
            res.render('view', {_files: files, _fileName: "Welcome", _fileContent: 'JavaScript'});
        }
    }); 
});

app.post('/topic', (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, err => {
        if(err) {
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+title);
    });
});

app.listen(3000, () => {
    console.log('server is running on 3000 port');
});