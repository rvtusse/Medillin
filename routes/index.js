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
	let file = './public/Mandem.mp4';
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
router.get('/video2', function(req, res) {
	let file = './public/trap.mp4';
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
