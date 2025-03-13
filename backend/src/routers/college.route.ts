import Router from "express";
import { lostOnCampusController } from "../controllers/college.controller";

const router = Router();

router.post("/find-location", lostOnCampusController);

export default router;
