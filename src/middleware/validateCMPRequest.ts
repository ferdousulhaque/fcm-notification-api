import { Request, Response, NextFunction, Router } from "express";
import logger = require('../utils/logger');
import Validator = require('jsonschema');

export const validateCMPRequest = (req: Request,
  res: Response,
  next: NextFunction) => {
        var cmpRequestSchema = {
          additionalProperties: true,
          properties: {
              UserID: {
                  id: 'UserID',
                  title: 'Check the MSISDN prefix',
                  type: 'string',
                  pattern: '^((?:(\\+?|00)?95)|0|00)?97[5-9]\\d{7}$',
                  minLength: 10,
                  maxLength: 12
              },
              NotificationText: {
                  id: 'NotificationText',
                  title: 'NotificationText',
                  type: 'string',
                  minimum: 2
              },
              NotificationTextContent: {
                  id: 'NotificationTextContent',
                  title: 'NotificationTextContent',
                  type: 'string',
                  minimum: 2
              },
              DeliverySubChannel: {
                  id: 'DeliverySubChannel',
                  title: 'DeliverySubChannel',
                  type: 'string',
                  minimum: 2
              },
              P3: {
                id: 'P3',
                title: 'shouldSave Parameter',
                type: 'string',
                minimum: 0,
                maximum: 1,
                pattern: "^([0-1]|1)$"
              }
          },
          required: [
              'UserID',
              'NotificationText',
              'NotificationTextContent',
              'DeliverySubChannel'
          ],
          type: 'object'
      };


      let requestBody = req.body;
      //console.log(Validator.validate(requestBody,cmpRequestSchema));
      if(Validator.validate(requestBody,cmpRequestSchema).valid){
        next();
      }else{
        res.status(400).send({
          validationFailedFor: Validator.validate(requestBody,cmpRequestSchema).errors,
          status : 'failed',
          message : 'Schema validation failed'
        })
      }
};