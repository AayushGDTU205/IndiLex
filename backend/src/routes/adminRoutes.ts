import { Router } from "express";
import { acceptLawyerReq, getLawyerReq, rejectLawyerReq } from "../controllers/AdminController";
let router=Router();

router.get('/getLawyerReq',getLawyerReq);
router.post('/acceptLawyerReq',acceptLawyerReq);
router.post('/rejectLawyerReq',rejectLawyerReq);
export default router;