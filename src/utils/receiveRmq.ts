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
 * Receive
 */
export const receive = async () => {
    try {
        logger.info("Worker Execute");
        var exchange = connection.declareExchange("ExchangeName");
        // declare a new queue, it will be created if it does not already exist (async)
        var queue = connection.declareQueue(config.rabbitmq.queueKey, {
            durable: true
        });
        queue.bind(exchange);
        // create a consumer function for the queue
        // this will keep running until the program is halted or is stopped with queue.stopConsumer()
        queue.activateConsumer(async function (message) {
            // fake a second of work for every dot in the message
            var content = await message.getContent();
            //console.log(content)
            var delay = 100;
            //var total = 1000;
            //logger.info("Message received: " + content);
            //setTimeout(function () {
            pgDb.getUserToken(JSON.parse(content).msisdn).then((token) => {
                token.rows.forEach(token => {
                    //console.log(token.fcm_token);
                    setTimeout(function () {
                        //console.log(token.fcm_token);
                        FCM.pushNotificationViaFcmToken(token, JSON.parse(content)).then(() => {
                            logger.info("[x] Done");
                        });
                    }, delay);
                })
            })
            //}, total);

            message.ack(); // acknowledge that the message has been received (and processed)
        }, {
            noAck: false
        });
    } catch (e) {
        logger.info(e);
        throw Error("No Live Connections");
    }
}