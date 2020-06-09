import { getPlaces } from "../providers/OpenCageDataProvider";
import * as sampleModel from "../models/pgsqlQuery";
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import logger = require('../utils/logger');
import * as FCM from '../providers/firebaseNotificationProvider';
import dotenv from "dotenv";

dotenv.config();

class NotificationController {
  public async sendNotification(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
      FCM.pushNotificationViaFcmToken(process.env.FCM_DEVICETOKEN || '',{body: "test", title: "test"}).then(() => {
        res.status(200).json({result: 'success'});
      });
  }
}

const notificationController = new NotificationController();

export {
  notificationController
};