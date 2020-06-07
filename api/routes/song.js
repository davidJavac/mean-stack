'use strict'

var SongController = require('../controller/song');

var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir : './upload/song'})

api.post('/song',md_auth.ensureAuth, SongController.saveSong);
api.get('/song/:id',md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?',md_auth.ensureAuth, SongController.getSongs);
api.post('/upload-file-song/:id',[md_auth.ensureAuth, md_upload], SongController.uploadAudio);
api.get('/get-file-song/:audio',SongController.getAudio);
api.put('/update-song/:id?',md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id?',md_auth.ensureAuth, SongController.deleteSong);

module.exports = api