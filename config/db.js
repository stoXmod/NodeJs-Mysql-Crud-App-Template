var sql = require('mysql2')
var db;

connection = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysqllogreg'
}

function createconnection() {
    if (!db) {
        db = sql.createConnection(connection);
    }
    db.connect(function(err) {
        if (err) {
            console.log('Error while connecting database!')
        } else {
            console.log('Database connected successfully')
        }
    })

    return db;
}


module.exports = createconnection();