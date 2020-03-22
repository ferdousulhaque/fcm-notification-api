import { Request, Response } from "express";
import { queueController } from "../controllers/QueueController";
import { validatePPGRequest } from "../middleware/validatePPGRequest";
import { validateCMPRequest } from "../middleware/validateCMPRequest";
import { whiteListIpToApi } from "../middleware/whiteListIp";

export default [
  // PPG Notification API
  {
    path: "/push/ppg/fcm",
    method: "get",
    handler: [
      whiteListIpToApi,
      validatePPGRequest,
      async (req: Request, res: Response) => {
        queueController.send(req, res);
      }
    ]
  },
  // CMP Notification API
  {
    path: "/push/cmp/fcm",
    method: "post",
    handler: [
      //validateCMPRequest,
      whiteListIpToApi,
      async (req: Request, res: Response) => {
        queueController.send(req, res);
      }
    ]
  }
];