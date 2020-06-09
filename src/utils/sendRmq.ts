import * as Amqp from "amqp-ts";
import logger = require('./../utils/logger');
import config = require('./../config/config');
import * as FCM from '../providers/firebaseNotificationProvider';
import * as pgDb from "../models/pgsqlQuery";

// Connection Initialization
const opt = {
    credentials: require('amqplib').credentials.plain(
        config.rabbitmq.user,
        config.rabbitmq.password
    )
};
const connection = new Amqp.Connection(config.rabbitmq.url, opt, {
    retries: config.rabbitmq.retry,
    interval: config.rabbitmq.retryInterval
});

// Open Connection
connection.on("open_connection", () => {
    logger.debug("Opening Single Connection");
});

// Closing Connection
connection.on("close_connection", () => {
    logger.debug("close_connection");
});

// Lost Connection
connection.on("lost_connection", () => {
    logger.debug("lost_connection");
});

// Trying to Connect
connection.on("trying_connect", () => {
    logger.debug("trying_connect");
});

// Error Connecting
connection.on("error_connection", (err) => {
    logger.error("Error Connecting to RabbitMQ on " + config.rabbitmq.url);
});

/*
 * Send transaction
 */
export const send = async (data: any) => {
    try {
        var exchange = connection.declareExchange("ExchangeName");
        var queue = connection.declareQueue(config.rabbitmq.queueKey, {
            durable: true
        });
        queue.bind(exchange);
        var msg = new Amqp.Message(JSON.stringify(data));
        exchange.send(msg);
        logger.debug("Message Send to RabbitMQ");
    } catch (e) {
        throw Error("No Live Connections");
    }
}

