const express = require('express')
const router = express.Router()
const Cosmic = require('cosmicjs')
const async = require('async')
const _ = require('lodash')
const axios = require('axios')
const config = require('../config')
const api = Cosmic()
const bucket = api.bucket(config.bucket)
const fs = require('fs')
const path = require('path')

router.get('/', function(req, res){
  res.render('index.handlebars')
});


router.get('/tour', function(req, res){
  res.render('tour.handlebars')
});


router.get('/photo-gallery', function(req, res){
  res.render('gallery.handlebars')
});


router.get('/photo-gallery/:slug', function(req, res){
  res.render('album.handlebars')
});


router.get('/videos', function(req, res){
  res.render('videos.handlebars')
});

router.get('/video', function(req, res) {
  const path = 'Public/Mandem.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  
  if (range) {
  const parts = range.replace(/bytes=/, "").split("-")
  const start = parseInt(parts[0], 10)
  const end = parts[1]
  ? parseInt(parts[1], 10)
  : fileSize-1
  
  const chunksize = (end-start)+1
  const file = fs.createReadStream(path, {start, end})
  const head = {
  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
  'Accept-Ranges': 'bytes',
  'Content-Length': chunksize,
  'Content-Type': 'video/mp4',
  }
  
  res.writeHead(206, head)
  file.pipe(res)
  } else {
  const head = {
  'Content-Length': fileSize,
  'Content-Type': 'video/mp4',
  }
  res.writeHead(200, head)
  fs.createReadStream(path).pipe(res)
  }
  })
  router.get('/video1', function(req, res) {
	let file = './public/chino.mp4';
	fs.stat(file, function(err, stats) {
		if(err)
		{
			if(err.code === 'ENOENT')
			{
				return res.sendStatus(404);
			}
			return next(err)
		}
		let range = req.headers.range;
		if(!range)
		{
			let err = new Error('Wrong range');
				err.status = 416;
			return next(err);
		}
		let positions = range.replace(/bytes=/, '').split('-');
		let start = parseInt(positions[0], 10);
		let file_size = stats.size;
		let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
		let chunksize = (end - start) + 1;
		let head = {
			'Content-Range': 'bytes ' + start + '-' + end + '/' + file_size,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4'
		}
		res.writeHead(206, head);
		let stream_position = {
			start: start,
			end: end
		}

		let stream = fs.createReadStream(file, stream_position)
		stream.on('open', function() {

			stream.pipe(res);

		})
		stream.on('error', function(err) {

			return next(err);

		});
  }
  );
});
router.get('/bio', function(req, res){
  res.render('bio.handlebars')
});


router.post('/signup', (req, res) => {
  const email = req.body.email
  axios.post(`https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members/`, {
    auth: {
      url: `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/`,
      user: `anystring:${process.env.MAILCHIMP_KEY}`
    },
    body: {
      "email_address": email,
      "status": "subscribed"
    }
  }).then(success => {
      res.redirect('/?subscribed=true')
  }).catch(err => {
    res.redirect('/?subscribed=false')
  })
})

module.exports = router;
