
'user strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

function pruebas(req, res){

    res.status(200).send({

        message : 'Probando una accion del controlador de usuario de la api rest con Node y Mongo'
    })
}

function saveUser(req, res){

    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    console.log("params.password " + params.password);

    if(params.password){

        //encriptar constraseña y guardar datos
        bcrypt.hash(params.password,null,null, function(err, hash){

            user.password = hash;

            if(user.name  && user.surname  && user.email ){

                console.log('user.name ' + user.name);
                console.log('user.surname ' + user.surname);

                User.findOne({email : user.email}).then(function(userExists){

                    if(userExists){
                        
                        res.status(400).send({message : 'El usuario que intenta guardar ya esta registrado'});
                    }
                    else{
    
                        //guarde usuario
                        user.save((err, userStored) => {
        
                            if(err){
                                res.status(500).send({message : 'Error al guardar el usuario'});
        
                            }
                            else{
                                if(!userStored){
        
                                    res.status(404).send({message : 'No se ha registrado el usuario'});
                                }
                                res.status(200).send({user : userStored});
                            }
                        });
    
                    }

                });
                

            }
            else{
                res.status(400).send({message : 'Rellena todos los campos'});
            }
        });
    }
    else{

        res.status(500).send({message : 'introduce la contraseña'});
    }
    
}

function loginUser(req, res){

    var params = req.body;

    var email = params.email;
    var password = params.password;

    console.log('email tolowercase ' + email.toLowerCase());

    User.findOne({email : email.toLowerCase()}, (err, user) =>{

            if(err){

                res.status(500).send({message : 'Error en la petición'});
            }
            else{
                if(!user){

                    res.status(404).send({message : 'El usuario no existe'});

                }
                else{

                    //comprobar la 
                
                    bcrypt.compare(password, user.password, function(err, check){
                        console.log('check ' + check);
                        if(check){

                            //devolver los datos del usuario logeado
                            if(params.gethash){
                                //devolver un token de jwt
                                res.status(200).send({

                                    token : jwt.createToken(user)
                                });
                            }
                            else{

                                res.status(200).send({user})
                            }
                        }
                        else{

                            res.status(404).send({message : 'El usuario no ha podido loguearse'});
                        }
                    });
                }
            }
        }
    );
}

function updateUser(req, res){

    var userId = req.params.id;
    var update = req.body;
    
    if(userId != req.user.sub){

        return res.status(500).send({message : 'No tienes permisos para actualizar este usuario'});

    }

    if(update.password){
        
        bcrypt.hash(req.body.password,null,null, function(err, hash){
            
            update.password = hash;
            User.findByIdAndUpdate(userId, update, (err, userUpdate) =>{

                if(err){
        
                    res.status(500).send({message : 'Error al actualizar el usuario'});
                }
                else{
                    if(!userUpdate){
                        
                        res.status(404).send({message : 'No se ha podido actualizar el usuario'});
                        
                    }
                    else{
                        
                        res.status(200).send({user : userUpdate});
        
                    }
                    
                }
            });
        });
    }
    else{

        User.findByIdAndUpdate(userId, update, (err, userUpdate) =>{

            if(err){
    
                res.status(500).send({message : 'Error al actualizar el usuario'});
            }
            else{
                if(!userUpdate){
                    
                    res.status(404).send({message : 'No se ha podido actualizar el usuario'});
                    
                }
                else{
                    
                    res.status(200).send({user : userUpdate});
    
                }
                
            }
        });

    }    
}

function uploadImage(req, res){

    var userId = req.params.id;

    var file_name = 'No subido';

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
    
        var file_ext = ext_split[1].toLocaleLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            User.findByIdAndUpdate(userId, {image : file_name}, (err, userUpdated) =>{

                if(!userUpdated){
                    
                    res.status(404).send({message : 'No se ha podido actualizar el usuario'});
                    
                }
                else{
                    
                    res.status(200).send({image : file_name, user : userUpdated});
        
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
    var path_file = './upload/users/'+imageFile;

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

    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile    

}