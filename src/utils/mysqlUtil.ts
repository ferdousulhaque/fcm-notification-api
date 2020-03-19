import * as mysql from 'mysql';
import config = require('./../config/config');
import logger = require('./../utils/logger');

const myconfig = {
    user: config.mysqldb.user,
    database: config.mysqldb.database,
    password: config.mysqldb.password,
    host: config.mysqldb.host,
    port: config.mysqldb.port,
    max: config.mysqldb.max,
    idleTimeoutMillis: config.mysqldb.idleTimeoutMillis
}

var pool = mysql.createPool(myconfig);

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        logger.error(`Database connection was closed.`);
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        logger.error(`Database has too many connections.`);
      }
      if (err.code === 'ECONNREFUSED') {
        logger.error(`Database connection was refused.`);
      }
    }
  
    if (connection) {
        logger.info(`mysql Connection OK`+JSON.stringify(myconfig));
        connection.release()
    }
  
    return
  })


export const sqlToDB = async (sql:string, data:string[][]) => {
    pool.getConnection(async function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        await connection.query(sql, data, function (error, results, fields) {
          // When done with the connection, release it.
          
          connection.release();
          //return results;
          // Handle error after the release.
          if (error) throw error;
       
          // Don't use the connection here, it has been returned to the pool.
        });
      });
}

export const insertToDB = async (sql:string, data: any) => {
    pool.getConnection(async function(err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        await connection.query(sql, data, function (error, results, fields) {
          // When done with the connection, release it.
          logger.info(`Adding to Recharge Table`);
          connection.release();
          //return results;
          // Handle error after the release.
          if (error) logger.warn(`Error Inserting: `+error);
       
          // Don't use the connection here, it has been returned to the pool.
        });
      });
}

export const selectPromise = (sql:string, data: any) => {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
        if (err) reject(err); // not connected!
        // Use the connection
        connection.query( sql, data, (error, results, fields) => {
            if ( error )
                return reject( error );
            resolve( results );
        });
      });
    });
}