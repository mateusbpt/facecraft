//Dependências
var express = require('express');
var app = express();
var routes = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var md5 = require('md5');
var salt = "facecraft";
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({
    extended: false
}));

//Configuração do Database
var db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'facecraft'
});

//Criptografia
function criptografarSenha(username, salt, senha) {
    return md5(username + salt + senha);
};

//Funções para o Usuário
function getUserById(id, callback) {
    return db.query('SELECT * FROM USER WHERE ID=?', id, callback);
};

function getUserByEmail(email, callback) {
    return db.query('SELECT * FROM USER WHERE EMAIL=?', email, callback);
};

function getAllUsers(callback) {
    return db.query('SELECT * FROM USER', [], callback);
};

function addUser(user, callback) {
    return db.query('INSERT INTO USER SET ?', [user], callback);
};



//Rotas para usuário
routes.get('/users', function (req, res, next) {
    getAllUsers(function (err, row) {
        if (err) {
            return next("MYSQL ERROR: Verifique a query utilizada");
        }

        res.status(200).json(row);
    });
});

routes.post('/users', jsonParser, function (req, res, next) {
    getUserByEmail(req.body.email, function (err, row) {
        if (err) {
            return next("MYSQL ERROR: Verifique a query utilizada");
        }
        if (row.length === 0) {
            var senha = criptografarSenha(req.body.username, salt, req.body.senha);
            var data = {
                "username": req.body.username,
                "email": req.body.email,
                "senha": senha,
                "imagem": req.body.imagem
            };
            console.log(data);
            addUser(data, function (err, row) {
                if (err) {
                    return next("MYSQL ERROR: Verifique a query utilizada");
                }
                res.json({
                    "mensagem": "Cadastro Realizado com sucesso"
                });
            });
        } else {
            return res.json({
                "mensagem": "E-mail já cadastrado, verifique"
            });
        }
    });
});

routes.get('/users/:id?', function (req, res, next) {
    getUserById(req.params.id, function (err, row) {
        if (err) {
            return next("MYSQL ERROR: Verifique a query utilizada");
        }

        res.status(200).json(row);
    });
});


//Rota inicial
routes.get('/', function (req, res) {
    res.send("Bem vindo a API Facecraft!");
});

app.use('/api', routes);


//Server start
var server = app.listen(3000, function () {
    console.log("Facecraft API conectado na porta %s", server.address().port);
});