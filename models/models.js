/// <reference path="../typings/tsd.d.ts" />

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite 	DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host	    = (url[4]||null);
var storage 	= process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
if(process.env.DATABASE_STORAGE != null){
  // Usar DDBB sqlite
  var dialect = 'sqlite'; var sequelize = new Sequelize (null, null, null, {dialect: dialect, storage: storage});}
else{
  // Usar DDBB postgres
  var sequelize = new Sequelize(DB_name, user, pwd,{
      dialect: protocol,
      protocol: protocol,
      port: port,
      host: host,
      storage: storage,
      omitNull: true
    }
  );
}

// Importar definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;// exportar definición de la tabla Quiz

// sequelize.sync() crea e inicializa tabla preguntas en DB
sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count===0){
			Quiz.create({
				pregunta: 'Cual es la capital de Italia',
				respuesta: 'Roma',
				tema: 'otro'
			});
			Quiz.create({
				pregunta: 'Cual es la capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'ciencia'
			})
	      	.then(function(){
					console.log('Base de datos inicializada')
			});
		};
	});
});