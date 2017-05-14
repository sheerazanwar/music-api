var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')
var fs = require('fs')

var ejs = require('ejs')
app.set('view engine', 'ejs')

var MAGIC_NUMBERS = {
	jpg: 'ffd8ffe0',
	jpg1: 'ffd8ffe1',
	png: '89504e47',
	gif: '47494638',
  mp3: '49443304',
  Mp3: '49443303'
}

function checkMagicNumbers(magic) {
  console.log(magic);
	if (magic == MAGIC_NUMBERS.jpg ||magic == MAGIC_NUMBERS.Mp3 ||magic == MAGIC_NUMBERS.mp3 || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true
}

app.get('/api/file', function(req, res) {
	res.render('index')
})

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

app.post('/api/file', function(req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
		var bitmap = fs.readFileSync('./uploads/' + req.file.filename).toString('hex', 0, 4)
		if (!checkMagicNumbers(bitmap)) {
			fs.unlinkSync('./uploads/' + req.file.filename)
			res.end('File is no valid')
		}
    console.log(req.file.path);
		res.end('File is uploaded')
	})
})

app.get('/:file(*)', function(req, res, next){ // this routes all types of file
  var path=require('path');
  var file = req.params.file;
  var path = path.resolve(".")+'/uploads/'+file;
  res.download(path); // magic of download fuction
});

app.get('/',function getFileInfoFromFolder(req,res) {
 var path=require('path');
 var path = path.resolve(".")+'/uploads/';
  let files = fs.readdirSync(path, 'utf8');
  let response = [];
  for (let file of files) {
    response.push({ name: file});
  }
  console.log(response);
  res.send(response);
})

var port = process.env.PORT || 8080
app.listen(port, function() {
	console.log('Node.js listening on port ' + port)
})