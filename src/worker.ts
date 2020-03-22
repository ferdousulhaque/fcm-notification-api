
//import * as sampleModel from "../models/pgsqlQuery";
import logger = require('./utils/logger');
import * as rabbit from './utils/rabbitMQ';

class Worker {

  public async receive() {
    await rabbit.receive();
  }
}

const worker = new Worker();
worker.receive();