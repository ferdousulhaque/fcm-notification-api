import { getPlaces } from "../providers/OpenCageDataProvider";
import * as sampleModel from "../models/pgsqlQuery";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import logger = require('../utils/logger');
import * as rabbit from '../utils/rabbitMQ';

class QueueController {

  public async send(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
    rabbit.send().then(()=> {
      res.status(200).json({
        status: 'success'
      });
    })
  }

  public async receive(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
    rabbit.receive().then(()=> {
      res.status(200).json({
        status: 'success'
      });
    })
  }
}

const queueController = new QueueController();

export {
  queueController
};