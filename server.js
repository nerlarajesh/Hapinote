var Hapi = require('hapi');
var handlebar = require('handlebars');
var jwt = require('json-web-token');
var Bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var fs = require('fs');
var path = require('path');
var server = new Hapi.Server();
server.connection({ port: 2000, host: 'localhost' });
server.register([{
        register: require('inert')
    },
    {
        register: require('vision')
    }
])
server.views({
    engines: {
        hbs: handlebar
    },
    path: __dirname + '/views'
})
var users = {
    rajesh: {
        username: 'rajesh',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // password is: 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};
server.register(Basic, function(err) {
    server.route([{
            method: 'GET',
            path: '/',
            config: {
                handler: function(request, reply) {
                    reply.view('index');
                    console.log('Login page loaded');
                }
            }
        },
        {
            method: 'POST',
            path: '/home',
            handler: function(request, reply) {
                if (!request.payload.name && !request.payload.pwd) {
                    reply.view('home', { message: 'Enter valid credentails' });
                    console.log('Home page loaded with Invalid Credentials');
                } else {
                    var user = users[request.payload.name];
                    if (!user) {
                        return false;
                    }
                    Bcrypt.compare(request.payload.pwd, user.password, function(err, isValid) {
                        if (isValid) {
                            reply.view('home', { message: 'Login Sucess' });
                            console.log('Home page loaded with valid Credentials');
                        } else {
                            reply.view('home', { message: 'Login Failure' });
                            console.log('Home page loaded with Invalid Credentials');
                        }
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/scripts/{file*}',
            handler: {
                directory: {
                    path: 'js'
                }
            }
        },
        {
            method: 'GET',
            path: '/css/{file*}',
            handler: {
                directory: {
                    path: 'css'
                }
            }
        },
        {
            method: 'POST',
            path: '/input.json',
            handler: {
                file: {
                    path: 'input.json'
                }
            }
        },
        {
            method: 'POST',
            path: '/list',
            handler: function(request, reply) {
                if (!fs.existsSync('./input.json')) {
                    fs.openSync('input.json', 'w', function(err, fd) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("File opened successfully!");
                    });
                } else {
                    var nav = JSON.parse(fs.readFileSync('./input.json', 'utf-8'));
                    if (nav[request.payload.name]) {
                        nav[request.payload.name] = { desc: request.payload.desc };
                        console.log(request.payload.desc);
                        fs.writeFileSync('input.json', JSON.stringify(nav));
                    } else {
                        nav[request.payload.name] = {};
                        nav[request.payload.name] = { desc: request.payload.desc };
                        fs.writeFileSync('input.json', JSON.stringify(nav));
                    }
                }
                var JSONData = JSON.parse(fs.readFileSync('./input.json', 'utf-8'));
                reply.view('list', { data: JSONData, key: '', description: '' });
            }
        }
    ]);

})

server.start(function() {
    console.log("server started and running successfully at: " + server.info.uri);
});