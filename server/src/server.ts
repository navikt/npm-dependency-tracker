import express = require('express');
const app: express.Application = express();

const PORT = 3001;

app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(PORT, function () {
    console.log('Server is listening on port' + PORT);
});
