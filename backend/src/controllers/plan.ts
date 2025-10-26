import { Response, Request } from "express";

function generatePlan(req: Request, res: Response) {
  return res.send("Plan");
}

export default {
  generatePlan
};