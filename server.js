var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')
var fs = require('fs')

var ejs = require('ejs')
app.set('view engine', 'ejs')



app.get('/api/file', function(req, res) {
	res.render('index')
})

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname)
	}
})

app.post('/api/file', function(req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
		var extension = (req.file.filename).split('.');
			console.log(extension[1]);
		
		if (extension[1]!='mp3') {
			fs.unlinkSync('./uploads/' + req.file.filename)
		
			res.end('File is no valid')
		}
	//	console.log((req.file.filename).split('.'));
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