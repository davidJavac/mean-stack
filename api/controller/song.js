'use strict'
var path = require('path');
var fs = require('fs');
var Song = require('../models/song');

function getSong(req, res){

    var id = req.params.id;
    
    Song.findById(id).populate({'path' : 'album'}).exec((err, song) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        else{
            
            if(!song){
                
                res.status(404).send({message : 'No se ha encontrado la cancion'});
                
            }
            else{

                res.status(200).send({song});

            }
        }
    })
    
}

function saveSong(req, res){

    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;    

    song.save((err, song) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        else{
            
            if(!song){
                
                res.status(404).send({message : 'La cancion no pudo ser guardada'});
                
            }
            else{
                
                res.status(200).send({song : song});

            }
        }
    })

}

function getSongs(req, res){

    var albumId = req.params.album;
    if(!albumId){
        
        var find = Song.find().sort('number');
    }
    else{
        
        var find = Song.find({album : albumId}).sort('number');
    }

    find.populate({
        path : 'album',
        populate : {

            path : 'artist',
            model : 'Artist'
        }
    }).exec((err,songs) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        
        else{
            
            if(!songs){
                
                res.status(404).send({message : 'No hay canciones'});
                
            }
            else{
                console.log("songs");
                console.log(songs);

                res.status(200).send({songs : songs});

            }
        }
    })

}

function updateSong(req, res){

    var id = req.params.id;
    
    var song = req.body;
    console.log('duration ' + song.duration);
    console.log('name' + song.name);
    console.log('id ' + id);
    Song.findByIdAndUpdate(id, song, (err, song) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        else{
            
            if(!song){
                
                res.status(404).send({message : 'No se ha encontrado la cancion'});
                
            }
            else{
                console.log("song updated");
                res.status(200).send({song : song});

            }
        }
    })
}

function deleteSong(req, res){

    var id = req.params.id;

    Song.findByIdAndDelete(id, (err, song)=>{

        if(err){
            res.status(500).send({message : 'Error en la peticion'});
        }
        else{

            if(!song){

                res.status(404).send({message : 'No se ha encontrado la cancion'});
            }
            else{
                
                res.status(200).send({song : song});

            }
        }
    })
}

function uploadAudio(req, res){

    var id = req.params.id;

    var file_name = 'archivo no subido';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        console.log('file_path ' + file_path);
        console.log('file_split ' + file_split);
        console.log('file_name ' + file_name);

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if(file_ext == 'mp3' || file_ext == 'ogg'){

            Song.findByIdAndUpdate(id, {file : file_name}, (err, song) => {

                if(err){

                    res.status(500).send({message : 'Error en la peticion'});
                }
                else{
                    if(!song){

                        res.status(404).send({message : 'No se ha encontrado la cancion'});
                    }
                    else{
                        
                        res.status(200).send({song : song});
                    }
                    
                }
            })
        }


    }
    else{

        res.status(404).send({message : 'No ha subido ningun audio'});
    }

}

function getAudio(req, res){

    var audioFile = req.params.audio;

    var path_file = './upload/song/' + audioFile;
    console.log(path_file);

    fs.exists(path_file, function(exists){

        if(exists){
            res.sendFile(path.resolve(path_file))
        }   
        else{
            res.status(404).send({message : 'No se ha encontrado la cancion'});
        }
    })

}

module.exports = {

    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadAudio,
    getAudio
}