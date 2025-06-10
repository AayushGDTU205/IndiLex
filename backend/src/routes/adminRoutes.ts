import { Router } from "express";
import { acceptLawyerReq, getLawyerReq } from "../controllers/AdminController";
let router=Router();

router.get('/getLawyerReq',getLawyerReq);
router.post('/acceptLawyerReq',acceptLawyerReq);
export default router;