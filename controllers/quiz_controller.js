var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
    models.Quiz.find({
        where: {
            id: Number(quizId)
        },
        include: [{
            model: models.Comment
        }]
    }).then(function(quiz) {
        if(quiz){
            req.quiz = quiz;
            next();
        }else{
            next(new Error('No existe quizId=' + quizId));
        }
    }).catch(function(error) {next(error)});
};

// GET /quizes                 || listado de preguntas
exports.index = function(req, res, next){
    var str = req.query.search;
    // Si se indica un texto a buscar, se realiza la búsqueda
    if(!req.query.search){
        str = '';
    }else{
        str = str.split(' ').join('%'); // URL-Cambio espacios por "%"
    }

    models.Quiz.findAll({where: ["lower(pregunta) like ?", '%'+ str.toLowerCase() + '%'], order: 'tema ASC'}).then(function(quizes){
        res.render('quizes/index', {quizes: quizes, errors:[]});
        }
    ).catch(function(error) { next(error); })
};

// GET /quizes/:id             || pregunta seleccionada
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz, errors:[]});
};

// GET /quizes/ :id/answer     || comprobación de respuesta
exports.answer = function(req, res) {
        var resultado = 'Incorrecto';
        if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
              resultado = 'Correcto';
        }
        res.render('quizes/answer', {quiz: req.quiz,
                                    respuesta: resultado,
                                    errors:[]});
};

// Formulario de nueva pregunta
exports.new = function(req,res){
    var quiz = models.Quiz.build({
        pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"
    });
    res.render('quizes/new', {quiz: quiz, errors:[]});
};

// Crear nueva pregunta
exports.create = function(req,res){
    var quiz = models.Quiz.build(req.body.quiz);
    quiz.validate().then(
        function(err){
            if(err){
                res.render('quizes/new',{quiz: quiz, errors: err.errors})
            }else{
                quiz.save({fields: ["pregunta","respuesta","tema"]}).then(function(){
                    res.redirect('/quizes');
                })
            }
        }
    );
};

// Edición de preguntas
exports.edit = function(req,res){
    var quiz = req.quiz;
    res.render('quizes/edit', {quiz: quiz, errors:[]});
};

// Actualización de cambios
exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    req.quiz.validate().then(
        function(err){
            if(err){
                res.render('quizes/edit',{
                    quiz: req.quiz,
                    errors: err.errors})
            }else{
                req.quiz.save({fields: ["pregunta","respuesta","tema"]})
                .then(function(){ res.redirect('/quizes'); })
            }
        }
    );
};

// Eliminar preguntas
exports.destroy = function(req,res,next){
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){
        next(error);
    });
};

// Carga la vista de Autor
exports.author = function(req, res){
    res.render('author', { title: 'Esta es la página de Créditos', errors: [] });
}