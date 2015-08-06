var users = { admin: {id: 1, username:"admin",password: "1234"},
              pepe: {id: 2, username:"alvaro",password: "5678"}
    };

// Comprobamos si el usuario está registrado en users
// Si la autenticación falla, se ejecutan los callbacks
exports.autenticar = function(login, password, callback){
    if(users[login]){
        if(password===users[login].password){
            callback(null, users[login]);
        }else{
            callback(new Error('Password erroneo.'));
        }
    }else{
        callback(new Error('No existe el usuario'));
    }
};