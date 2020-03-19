import {
  getPlaces
} from "../providers/OpenCageDataProvider";
import * as sampleModel from "../models/pgsqlQuery";
import * as mysqlModel from "../models/mysqlQuery";
import {
  Request,
  Response
} from 'express';
import {
  QueryResult
} from 'pg';
import logger = require('../utils/logger');
import * as rabbit from '../utils/rabbitMQ';
import * as FCM from '../providers/firebaseNotificationProvider';
import dotenv from "dotenv";

dotenv.config();

class CdrController {
  public async addtoRechargeTable(req: Request < import("express-serve-static-core").ParamsDictionary > , res: Response) {
    //Check if myTelenor user
    let result: QueryResult;
    try {
      let tableName = "topup_logs_"+req.body.timeStamp.substring(0, 8);
      result = await sampleModel.getUserInfoModel(req.body.msisdn);
      if (result.rows === undefined || result.rows.length > 0) {
        const userId = result.rows[0].id;
        mysqlModel.addToRechargeTable(req.body, userId);
        res.status(200).send({
          status: 'success',
          message: 'OK'
        })
      } else {
        res.status(404).send({
          status: 'success',
          message: 'Not MyTelenor User'
        })
      }
    } catch (error) {
      logger.error(`DB Query error`);
      res.status(403).json({
        status: 'failed',
        message: 'DB Query Error'
      });
    }
  }
}

const cdrController = new CdrController();

export {
  cdrController
};