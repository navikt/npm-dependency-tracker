const app = require('./app');

const PORT = 3001;

app.listen(PORT, function () {
    app.emit('ready', null);
    console.log('Server is listening on port ' + PORT);
});
