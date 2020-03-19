import dotenv from "dotenv";

dotenv.config();

const config = {
  serviceName: process.env.SERVICENAME || 'nodejs-typescript',
  port: Number(process.env.PORT) || 8081,
  loggerLevel: 'debug',
  pgsqldb: {
      user: process.env.REPLICATION_DB_USER || '',
      database: process.env.REPLICATION_DB || '',
      password: process.env.REPLICATION_DB_PASS || '',
      host: process.env.REPLICATION_DB_IP || '',
      port: Number(process.env.REPLICATION_DB_PORT) || 5432,
      max: Number(process.env.DB_MAX_CLIENTS) || 20,
      idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000
  },
  mysqldb: {
    user: process.env.MYSQL_DB_USER || '',
    database: process.env.MYSQL_DB || '',
    password: process.env.MYSQL_DB_PASS || '',
    host: process.env.MYSQL_DB_IP || '',
    port: Number(process.env.MYSQL_DB_PORT) || 5432,
    max: Number(process.env.DB_MAX_CLIENTS) || 20,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000
  }
}

export = config;