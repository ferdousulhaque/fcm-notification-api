import { Request, Response } from "express";
import { queueController } from "../controllers/QueueController";
import { cdrController } from "../controllers/cdrController";
import { checkSearchParams } from "../middleware/checks";
import { validateRequest } from "../middleware/validateRequest";

export default [
  {
    path: "/v1/cdr/recharge/recharge-cdr",
    method: "post",
    handler: [
      validateRequest,
      async (req: Request, res: Response) => {
        cdrController.addtoRechargeTable(req, res);
      }
    ]
  }
];