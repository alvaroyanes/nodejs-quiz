/// <reference path="../typings/tsd.d.ts" />

var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,{
	dialect: "sqlite",
	storage: "quiz.sqlite"
});

// Importar definicion de la tabla Quiz
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
				tema: 'Geografía'
			});
			Quiz.create({
				pregunta: 'Cual es la capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'Turismo'
			})
	      	.then(function(){
					console.log('Base de datos inicializada')
			});
		};
	});
});