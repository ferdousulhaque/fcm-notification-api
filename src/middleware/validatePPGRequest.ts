import { Request, Response, NextFunction, Router } from "express";
import logger = require('../utils/logger');
import Validator = require('jsonschema');

export const validatePPGRequest = (req: Request,
  res: Response,
  next: NextFunction) => {
        var cdrRequestSchema = {
          additionalProperties: false,
          properties: {
              msisdn: {
                  id: '/properties/msisdn',
                  title: 'Check the MSISDN prefix',
                  type: 'string',
                  pattern: '^((?:(\\+?|00)?95)|0|00)?97[4-9]\\d{7}$',
                  minLength: 10,
                  maxLength: 12
              },
              type: {
                  id: '/properties/type',
                  title: 'type',
                  type: 'string',
                  minimum: 10
              },
              transactionId: {
                  id: '/properties/transactionId',
                  title: 'transactionId',
                  type: 'string',
                  minimum: 10
              },
              channel: {
                  id: '/properties/channel',
                  title: 'channel',
                  type: 'string',
                  minimum: 10
              },
              push: {
                  id: '/properties/push',
                  title: 'push',
                  type: 'object',
                  required: ["title", "body"],
                  properties: {
                      title: {
                          "type": "string"
                      },
                      body: {
                          "type": "string"
                      }
                  }
              }
          },
          required: [
              'msisdn',
              'type',
              'transactionId',
              'channel',
              'push'
          ],
          type: 'object'
      };

        
        let requestBody = req.body;
       
        if(Validator.validate(requestBody,cdrRequestSchema).valid){
          next();
        }else{
          res.status(400).send({
            status : 'failed',
            message : 'Schema validation failed'
          })
        }

        
  };