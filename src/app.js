const express = require('express');
const AdminAuth = require('./middlewares/auth');

const app = express();

const r1 = (req, res, next) => {
    console.log('getroute 1');
    next();
    // res.send('enroute to swizz')
}

const r2 = (req, res, next) => {
    console.log('getroute 2');
    next();
    // res.send('we are here');
}

const r3 = (req, res, next) => {
    console.log('getroute 3');
    next();
    // res.send('lalalal land');
}

app.use('/Admin', AdminAuth);

app.get('/Admin/getUser', (req, res) => {
    res.send('Admin route');
})


//request handler
app.use("/users",(req,res, next) => {
    console.log('route' );
    // res.send('route handler one');
    next();
    
},(req, res,next) => {
    console.log('route 2');
    // res.send('route handler two');
    next();
    res.send('there you are');
}),(req, res,next) => {
    console.log('route 3');
    res.send('route handler three');
    next();
},(req, res,next) => {
    console.log('route 4');
    res.send('route handler four');
    next();
}

app.use('/getter', r1, r2, r3, (req, res) => {
    res.send('route handler five');
});



app.listen(8010, () => {
    console.log('Server is running on port 8010');
});