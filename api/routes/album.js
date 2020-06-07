'use strict'

var express = require('express');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');
var AlbumController = require('../controller/album');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir : './upload/album'});

api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artistId?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/update-album/:id?', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id?', md_auth.ensureAuth, AlbumController.deleteAlbum);

api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload, AlbumController.uploadImage])
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);


module.exports = api;