import * as Amqp from "amqp-ts";
import dotenv from "dotenv";
import logger = require('./../utils/logger');

dotenv.config();

/*
 * Send transaction
 */
export const send = async () => {
    const opt = {
        credentials: require('amqplib').credentials.plain(
            'guest',
            'guest'
        )
    };
    var connection = new Amqp.Connection(process.env.PUSH_QUEUE_URL, opt, {
        retries: 3,
        interval: 1500
    });
    //logger.debug(await connection.isConnected);

    connection.on("open_connection", () => {
        logger.debug("Opening connection");
        var exchange = connection.declareExchange("ExchangeName");
        var queue = connection.declareQueue("notification");
        queue.bind(exchange);
        var msg = new Amqp.Message("Ferdous");
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
        logger.error("Error Connecting to RabbitMQ on " + process.env.PUSH_QUEUE_URL);
    });
}

/*
 * Receive
 */
export const receive = async () => {
    // var connection = new Amqp.Connection(process.env.PUSH_QUEUE_URL);
    // var exchange = connection.declareExchange("ExchangeName");
    // var queue = connection.declareQueue("notification");
    // queue.bind(exchange);
    // await queue.activateConsumer((message) => {
    //     logger.debug("Message received: " + message.getContent());
    // });

    // create a new connection (async)
    const opt = {
        credentials: require('amqplib').credentials.plain(
            'guest',
            'guest'
        )
    };
    var connection = new Amqp.Connection(process.env.PUSH_QUEUE_URL, opt, {
        retries: 3,
        interval: 1500
    });

    connection.on("open_connection", () => {
        var exchange = connection.declareExchange("ExchangeName");
        // declare a new queue, it will be created if it does not already exist (async)
        var queue = connection.declareQueue("notification", {
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
        logger.error("Error Connecting to RabbitMQ on " + process.env.PUSH_QUEUE_URL);
    });
}