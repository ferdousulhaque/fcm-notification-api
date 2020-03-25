import { getPlaces } from "../providers/OpenCageDataProvider";
import * as sampleModel from "../models/pgsqlQuery";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import logger = require('../utils/logger');
import * as rabbit from '../utils/rabbitMQ';

class QueueController {

  public async send(req: Request, res: Response, isCmp: Number) {
    
    var details = null;

    if(isCmp === 0){
      details = {
        msisdn: req.body.msisdn,
        title: req.body.push.title,
        body: req.body.push.body,
        deeplink: req.body.push.deeplink
      };
    }

    if(isCmp === 1){
      details = {
        msisdn: req.body.UserID,
        title: req.body.NotificationText,
        body: req.body.NotificationTextContent
      };
    }
    if(details != null){
      rabbit.send(details).then(()=> {
        res.status(200).json({
          status: 'success'
        });
      })
    }else{
      res.status(400).json({
        status: 'failed'
      });
    }
    
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