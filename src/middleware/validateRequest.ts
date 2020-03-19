import { Request, Response, NextFunction, Router } from "express";
import logger = require('../utils/logger');
import Validator = require('jsonschema');

export const validateRequest = (req: Request,
  res: Response,
  next: NextFunction) => {
        var cdrRequestSchema = {
          additionalProperties: false,
          properties: {
            msisdn: {
              id: '/properties/msisdn',
              title: 'Check the MSISDN prefix',
              type: 'number',
              pattern: '^((?:(\\+?|00)?95)|0|00)?97[5-9]\\d{7}$',
              minLength: 10,
              maxLength: 12
            },
            rechargeAmount: {
              id: '/properties/rechargeAmount',
              title: 'rechargeAmount',
              type: 'number',
              minimum: 2
            },
            timeStamp: {
              id: '/properties/timeStamp',
              title: 'timeStamp',
              type: 'string',
              pattern: '^(([0-9]{4})(0[1-9]{1}|1[0-2]{1})(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1})(0[1-9]{1}|1[0-9]{1}|2[0-3]{1})([0-5]{1}[0-9]{1})([0-5]{1}[0-9]{1}))$'
            },
            uniqueTransactionId: {
              id: '/properties/uniqueTransactionId',
              title: 'uniqueTransactionId',
              type: 'string',
              minimum: 10
            }
          },
          required: [
            'msisdn',
            'rechargeAmount',
            'timeStamp',
            'uniqueTransactionId'
          ],
          type: 'object'
        };

        
        let requestBody = req.body;

        if(typeof requestBody.timeStamp !== 'undefined'){
          requestBody.timeStamp = String(requestBody.timeStamp);
        }
       
        if(Validator.validate(requestBody,cdrRequestSchema).valid){
          next();
        }else{
          res.status(400).send({
            status : 'failed',
            message : 'Schema validation failed'
          })
        }

        
  };