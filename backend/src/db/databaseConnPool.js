const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class ConnectionPool {
    constructor(database, poolSize) {
        this.poolSize = poolSize;
        this.connections = [];
        for (let i = 0; i < poolSize; i++) {
            const connection = new sqlite3.Database(path.join(__dirname, database ));
            this.connections.push(connection);
        }
    }

    getConnection() {
        return this.connections.pop();
    }

    releaseConnection(connection) {
        this.connections.push(connection);
    }
}

module.exports = ConnectionPool;
