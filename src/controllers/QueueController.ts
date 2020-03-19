import { getPlaces } from "../providers/OpenCageDataProvider";
import * as sampleModel from "../models/pgsqlQuery";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import logger = require('../utils/logger');
import * as rabbit from '../utils/rabbitMQ';

class QueueController {
  public async create(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
      //throw new Error("Method not implemented.");
      // res.status(200).send({
      //   test: 'success'
      // });
      // getPlaces('berlin').then(data => {
      //   res.status(200).send({
      //     test: data
      //   });
      // })
      let result : QueryResult;
      try {
          result = await sampleModel.getTimeModel();
          res.status(200).json(result.rows);
      } catch (error) {
          logger.error(`getTime error: ${error.message}`);
          res.status(500).json({status:'error', message: error.message, statusCode: 500});
      }
  }

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