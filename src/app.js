const express = require('express');
const connectDB = require('./config/database');
require('./config/database');

const app = express();

connectDB().then(() => {
    console.log('Database connected.....');
}).catch((err) => {
    console.log(err);
})

app.listen(8010, () => {
    console.log('Server is running on port 8010');
});