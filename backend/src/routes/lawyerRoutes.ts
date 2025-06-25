import { Router } from "express";
import { AcceptCase, getReviewedCases, getUserReq, RejectCase } from "../controllers/LawyerController";
const router=Router();

router.get('/getCases',getUserReq);
router.post('/accept',AcceptCase);
router.post('/reject',RejectCase);
router.get('/getRevCases',getReviewedCases);
export default router;