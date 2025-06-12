import { Router } from "express";
import { getUserReq } from "../controllers/LawyerController";
const router=Router();

router.get('/getCases',getUserReq);

export default router;