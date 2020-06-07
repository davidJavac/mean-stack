'use strict'

var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path'); 

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){

    var albumId = req.params.id;

    Album.findById(albumId).populate({path : 'artist'}).exec((err, album) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        else{
            
            if(!album){
                
                res.status(404).send({message : 'No se ha encontrado el album'});
                
            }
            else{
                res.status(200).send({album : album});

            }
        }
    })

}

function getAlbums(req, res){

    var artistId = req.params.artistId;

    if(!artistId){

        var find = Album.find({}).sort('title');
    }
    else{
        var find = Album.find({artist : artistId}).sort('year');

    }

    find.populate({path : 'artist'}).exec((err, albums) =>{

        if(err){

            res.status(500).send({message : 'Error en el servidor'});
        }
        else{
            
            if(!albums){

                res.status(404).send({message : 'No hay albums'});
                
            }
            else{

                res.status(200).send({albums : albums});
                
            }
        }
    })

}


function saveAlbum(req, res){

    var album = new Album();

    var params  = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, album) =>{

        if(err){
            
            res.status(500).send({message : 'Error en el servidor'});
        }
        else{
            if(!album   ){
                
                res.status(404).send({message : 'No se ha podido guardar el album'});
            }
            else{
                
                res.status(200).send({album : album});
                
            }
        }
    })
}

function updateAlbum(req, res){

    var id = req.params.id;

    var update = req.body;

    Album.findByIdAndUpdate(id, update, (err, album) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        else{

            if(!album){

                res.status(404).send({message : 'No se ha actualizado el album'});
            }
            else{
                
                res.status(200).send({album : album});

            }
        }

    });
}

function deleteAlbum(req, res){

    var id = req.params.id;

    Album.findByIdAndRemove(id, (err, album) =>{
        
        if(err){

            res.status(500).send({message : 'Error en la peticion'});
        }
        else{
            if(!album){
                
                res.status(404).send({message : 'No se ha encontrado el album para remover'});
                
            }
            else{
                
                Song.find({album : album}).remove((err, songRemoved) =>{
                    
                    if(err){
                        
                        res.status(500).send({message : 'Error en la peticion'});
                        
                    }
                    else{
                        if(!songRemoved){

                            res.status(404).send({message : 'No se encontro la cancion ha eliminar'});
                            
                        }
                        else{
                            
                            res.status(200).send({album : album});

                        }
                    }
                })
            }

        }
    })
}

function uploadImage(req, res){

    var albumId = req.params.id;

    var file_name = 'No subido';

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
    
        var file_ext = ext_split[1].toLocaleLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Album.findByIdAndUpdate(albumId, {image : file_name}, (err, albumUpdated) =>{

                if(!albumUpdated){
                    
                    res.status(404).send({message : 'No se ha podido actualizar el album'});
                    
                }
                else{
                    
                    res.status(200).send({album : albumUpdated});
        
                }
                
            });
        }
        else{
            
            res.status(404).send({message : 'Extension del archivo no correcta'});
            
        }
    }
    else{

        res.status(404).send({message : 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    
    var imageFile = req.params.imageFile;
    var path_file = './upload/album/'+imageFile;

    fs.exists(path_file, function(exists){

        if(exists){
            
            res.sendFile(path.resolve(path_file))
        }
        else{
            
            res.status(404).send({message : 'No existe la imagen'});

        }
    })
}

module.exports = {

    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}