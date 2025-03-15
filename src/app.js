const express = require('express');

const app = express();


//request handler
app.use((req, res) => {
    res.send('Hello World, yes');
})

app.listen(8010, () => {
    console.log('Server is running on port 8010');
});