const app = require('./app');

const PORT = 3001;

app.listen(PORT, function () {
    if (!process.argv.includes('--dev')) {
        app.emit('start-cronjob', null);
    }
    app.emit('reload-data', null);
    console.log('Server is listening on port ' + PORT);
});
