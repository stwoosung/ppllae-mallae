const ConnectionPool = require('./databaseConnPool'); 

const dbPath = '/ref.db'; 
const pool = new ConnectionPool(dbPath, 10); 

function executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        const connection = pool.getConnection();
        connection.all(sql, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            pool.releaseConnection(connection); 
            resolve(rows);
        });
    });
}

module.exports = {
    executeQuery,
};
