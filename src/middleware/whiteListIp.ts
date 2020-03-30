import { Request, Response, NextFunction, Router } from "express";
import logger = require('../utils/logger');

export const whiteListIpToApi = (req: Request,
  res: Response,
  next: NextFunction) => {
        const whitelistedIps = [
            '::1',
            '127.0.0.1',
            '0.0.0.0',
            '10.84.255.12',
            '10.84.73.198',
            '10.84.73.199'
          ];
          //logger.debug(req.connection.remoteAddress);
          if(whitelistedIps.find((x) => x===req.connection.remoteAddress)){
            //logger.debug("Whitelisted");
            next()
          }else{
            //logger.debug("Bad IP");
            res.status(403).send({
                message : 'Unauthorized'
            })
          }
  };