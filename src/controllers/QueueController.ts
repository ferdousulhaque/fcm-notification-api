import { getPlaces } from "../providers/OpenCageDataProvider";
import * as sampleModel from "../models/pgsqlQuery";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import logger = require('../utils/logger');
import * as rabbit from '../utils/rabbitMQ';

class QueueController {

  public async send(req: Request, res: Response) {
    const details = {
      title: req.body.push.title,
      body: req.body.push.body,
      deeplink: req.body.push.deeplink
    };
    rabbit.send(details).then(()=> {
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