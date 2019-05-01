const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
// ------ Middleware
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
const credentials = require('../src/modules/credentials.js');
// ----- Session Config
SESS_SECRET = "rgfgfdagfdgkjlkj"

app.set('trust proxy', 1)
sessConfig = {
    secret: credentials,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60 * 24 }
}

app.use(session(sessConfig))

if (app.get('env') === 'production') {
    sessConfig.cookie.secure = true;
}
// ----- End Session Config

app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080']
}));

// -----Mongoose Config
mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://localhost/todolist',
    { useNewUrlParser: true }
);

// ----- Todo Schema Config
const TodoSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Please enter the Todo"], minlength: [5, "Todo must be 5 or more characters"] },
    completed: { type: Boolean, default: false }
},
    { timestamp: true }

);
var Todo = mongoose.model('Todo', TodoSchema);
// ----- End Todo Schema Config 

// ----- User Schema Config
const UserSchema = new mongoose.Schema({
    userName: { type: String, required: [true, "Please create a username"], unique: [true, "Username Already exists"], minlength: [5, "Username must be 5 or more characters"] },
    password: { type: String, required: [true, "Please enter a password"], minlength: [8, "Password must be 8 or more characters"] },
    todos: [TodoSchema]
},
    { timestamp: true }
);
mongoose.model('User', UserSchema);
var User = mongoose.model('User');
// ----- End User Schema Config

// ----- User Authentication
const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
        res.json({
            error: "not logged in"
        });
    } else {
        next();
    }
}

// ----- Routes Start

// ----- Find all Todos
app.get('/api/todo/:id', (req, res) => {
    User.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.json({
                err
            })
        } else {
            res.json({
                data
            })
        }
    })
});

//----- Add New Todo
app.patch('/api/todo/:id', (req, res) => {
    Todo.create({ title: req.body.todo.title, goalDate: req.body.todo.date }, (err, data) => {
        if (err) {
            res.json({
                err
            });
        } else {
            User.findOneAndUpdate({ _id: req.params.id }, { $push: { todos: data } }, (err, data) => {
                if (err) {
                    res.json({
                        err
                    });
                } else {
                    res.json({
                        data
                    });
                };
            });
        };
    });
});

// ----- Update Complete
app.patch('/api/todo/:user/:todo', (req, res) => {
    User.find({ _id: req.params.user }, (err, data) => {
        if (err) {
            res.json({
                err
            });
        } else {
            var todo = data[0].todos.id(req.params.todo);
            todo.completed = req.body.completed

            data[0].save((err) => {
                if (err) {
                    res.json({
                        err
                    })
                } else {
                    res.json({
                        data
                    });
                };
            });
        };
    });
});
// ----- Delete Todo
app.delete('/api/todo/:user/:todo', (req, res) => {
    User.findOneAndUpdate({ _id: req.params.user }, { $pull: { todos: { _id: req.params.todo } } },
        (err, data) => {
            if (err) {
                res.json({
                    err
                })
            } else {
                res.json({
                    data
                })
            }
        })

})
// ----- Find One User For Registration
app.get('/api/user/:user', (req, res) => {
    User.findOne({ userName: req.params.user }, (err, data) => {
        if (err) {
            res.json({
                err
            })
        } else {
            res.json({
                data
            });
        }
    })
})
// ----- Find One User for Profile
app.get('/api/user/profile/:id', redirectLogin, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.json({
                err
            })
        } else {
            res.json({
                data
            });
        }
    })
})
// ----- Login User
app.post('/api/user/login', (req, res) => {
    User.findOne({ userName: req.body.username }, (err, data) => {
        if (err) {
            res.json({
                err
            })
        } else if (!data) {
            res.json({
                apiStatus: false,
                msg: "Incorrect username or password"
            });
        } else {
            bcrypt.compare(req.body.password, data.password, (err, result) => {
                if (err) {
                    res.json({
                        err
                    });
                } else if (result === false) {
                    res.json({
                        apiStatus: false,
                        msg: "Incorrect username or password"
                    })
                } else {
                    req.session.user = data._id;
                    res.json({
                        data,
                    })
                }
            });
        }
    })

})

// ----- Register User
app.post('/api/user', (req, res) => {
    User.findOne({ userName: req.body.username }, (err, data) => {
        if (err) {
            res.json({
                err
            })
        } else if (data) {
            res.json({
                apiStatus: false,
                msg: "Username Already Exists"
            })
        } else {
            user_instance = new User({
                userName: req.body.username,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user_instance.password, salt, (err, hash) => {
                    if (err) {
                        console.log("ERROR hashing password", err);
                    } else {
                        user_instance.password = hash;
                        user_instance.save((err) => {
                            if (err) {
                                res.json({
                                    err
                                })
                            } else {
                                req.session.user = user_instance._id;
                                res.json({
                                    status: true
                                })
                            }

                        })
                    }
                });
            });
        }
    })
})

// // ----- Sign User Out 
app.get('/api/user', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            res.json({
                status: false
            });
        } else {
            res.json({
                status: true
            });
        }
    })
})

// ------ End Routes

// Port 
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("listening on 8000");
});