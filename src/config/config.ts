import dotenv from "dotenv";

dotenv.config();

const config = {
  serviceName: process.env.SERVICENAME || 'notification-api',
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
  rabbitmq: {
      url: process.env.PUSH_QUEUE_URL || 'amqp://localhost',
      user: process.env.RABBITMQ_USER || 'guest',
      password: process.env.RABBITMQ_PASS || 'guest',
      queueKey: process.env.PUSH_QUEUE_KEY || 'notification',
      retry: 3,
      retryInterval: 1500,
  },
  firebase: {
    endpoint: process.env.FCM_ENDPOINT || '',
    key: process.env.FCM_SERVER_KEY || '',
    testDevice: process.env.FCM_TESTDEVICETOKEN || ''
  }
}

export = config;