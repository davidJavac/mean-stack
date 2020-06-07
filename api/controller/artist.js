'use strict'

var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path'); 

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function saveArtist(req, res){

    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) =>{

        if(err){

            res.status(500).send({message : 'Error al guardar el artista'});
        }
        else{
            if(!artistStored){
                
                res.status(404).send({message : 'El artista no ha sido guardado'});
                
            }
            else{
                
                res.status(200).send({artist : artistStored});
                
            }

        }
    });
}

function getArtist(req, res){

    var idArtist = req.params.idArtist;

    Artist.findById(idArtist, (err, artist) =>{

        if(err){

            res.status(500).send({message : 'Error en la peticion'});

        }
        else{
            if(artist){

                res.status(200).send({artist});
            }
            else{
                
                res.status(404).send({message : 'El artista solicitado no existe'});
            }
        }
    })

}

function getArtists(req, res){

    if(req.params.page){

        var page = req.params.page;
    }
    else{
        
        var page = 1;

    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){

        if(err){

            res.status(500).send({message : 'Error en la peticion'});
            
        }
        else{
            if(!artists){
                
                res.status(404).send({message : 'No hay artistas'});
                
            }
            else{
                
                res.status(200).send({total_items : total, artists : artists});

            }
        }
    });

}

function updateArtist(req, res){

    var id = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(id, update, (err, artistUpdated) =>{
        
        if(err){
            res.status(500).send({message : 'Error en la peticion'});
        }
        else{
            
            if(!artistUpdated){
                
                res.status(404).send({message : 'No se ha podido actualizar el artista'});
            }   
            else{
                
                res.status(200).send({artistUpdated});
            }
        }
    })
}

function deleteArtist(req, res){

    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, function(err, artistRemoved){
        
        if(err){

            res.status(500).send({message : 'Error al eliminar artista'});
        }
        else{
            if(!artistRemoved){

                res.status(404).send({message : 'El artista no ha sido eliminado'});
                Album.find({artist : artistRemoved._id}).remove((err, albumRemoved) =>{
                    if(err){
            
                        res.status(500).send({message : 'Error al eliminar album'});
                    }
                    else{
                        if(!albumRemoved){
            
                            res.status(404).send({message : 'El album no ha sido eliminado'});
                        }
                        else{
                            Song.find({album : albumRemoved._id}).remove((err, songRemoved) =>{
                                if(err){
                        
                                    res.status(500).send({message : 'Error al eliminar la cancion'});
                                }
                                else{
                                    if(!songRemoved){
                        
                                        res.status(404).send({message : 'La cancion no ha sido eliminada'});
                                    }
                                    else{
                                        res.status(200).send({artist : artistRemoved});
                                        
                                    }
                                }
                            });         
                            
                        }
                    }
                });
            }
            else{
                
                console.log("artista eliminado");
                console.log(artistRemoved);
                res.status(200).send({artistRemoved});
            }
        }
    })
}
function uploadImage(req, res){

    var artistId = req.params.id;

    var file_name = 'No subido';

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
    
        var file_ext = ext_split[1].toLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Artist.findByIdAndUpdate(artistId, {image : file_name}, (err, artistUpdated) =>{

                if(!artistUpdated){
                    
                    res.status(404).send({message : 'No se ha podido actualizar el artista'});
                    
                }
                else{
                    
                    res.status(200).send({artist : artistUpdated});
        
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
    var path_file = './upload/artists/'+imageFile;

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

    getArtist,
    saveArtist,
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}