import { Router } from "express";
import { AcceptCase, getUserReq, RejectCase } from "../controllers/LawyerController";
const router=Router();

router.get('/getCases',getUserReq);
router.post('/accept',AcceptCase);
router.post('/reject',RejectCase);
export default router;