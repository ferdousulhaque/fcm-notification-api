import * as Amqp from "amqp-ts";
import logger = require('./../utils/logger');
import config = require('./../config/config');

/*
 * Send transaction
 */
export const send = async (data: any) => {
    const opt = {
        credentials: require('amqplib').credentials.plain(
            config.rabbitmq.user,
            config.rabbitmq.password
        )
    };
    var connection = new Amqp.Connection(config.rabbitmq.url, opt, {
        retries: config.rabbitmq.retry,
        interval: config.rabbitmq.retryInterval
    });
    //logger.debug(await connection.isConnected);

    connection.on("open_connection", () => {
        logger.debug("Opening connection");
        var exchange = connection.declareExchange("ExchangeName");
        var queue = connection.declareQueue(config.rabbitmq.queueKey);
        queue.bind(exchange);
        var msg = new Amqp.Message(JSON.stringify(data));
        exchange.send(msg);
        logger.debug("Message send");
    });

    // connection.on("close_connection", ()=> {
    //     logger.debug("close_connection");
    // });

    // connection.on("lost_connection", () => {
    //     logger.debug("lost_connection");
    // });

    // connection.on("trying_connect", ()=> {
    //     logger.debug("trying_connect");
    // });

    connection.on("error_connection", (err) => {
        logger.error("Error Connecting to RabbitMQ on " + config.rabbitmq.url);
    });
}

/*
 * Receive
 */
export const receive = async () => {
    const opt = {
        credentials: require('amqplib').credentials.plain(
            config.rabbitmq.user,
            config.rabbitmq.password
        )
    };
    var connection = new Amqp.Connection(config.rabbitmq.url, opt, {
        retries: config.rabbitmq.retry,
        interval: config.rabbitmq.retryInterval
    });

    connection.on("open_connection", () => {
        var exchange = connection.declareExchange("ExchangeName");
        // declare a new queue, it will be created if it does not already exist (async)
        var queue = connection.declareQueue(config.rabbitmq.queueKey, {
            durable: true
        });
        queue.bind(exchange);
        // create a consumer function for the queue
        // this will keep running until the program is halted or is stopped with queue.stopConsumer()
        queue.activateConsumer(function (message) {
            // fake a second of work for every dot in the message
            var content = message.getContent();
            var seconds = content.split('.').length - 1;
            logger.debug("Message received: " + content);
            setTimeout(function () {
                logger.debug("[x] Done");
                message.ack(); // acknowledge that the message has been received (and processed)
            }, seconds * 1000);
        }, {
            noAck: false
        });
    });

    connection.on("error_connection", (err) => {
        logger.error("Error Connecting to RabbitMQ on " + config.rabbitmq.url);
    });
}