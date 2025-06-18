import { Router } from "express";
import { getKhabar, getLawyers, postLawyerFillUp, postLogin, postSignup, sendReqToLawyer } from "../controllers/UserController";
import { verifyJwt } from "../middlewares/verifyJWT";
const router=Router();

router.get('/',(req,res)=>{
    res.json("inside route 1");
})
// router.get('/login')

router.post('/login',postLogin);
router.post('/SignUp',postSignup);
router.post('/LaywerFillUp',verifyJwt,postLawyerFillUp);
router.get('/getLawyers',verifyJwt,getLawyers);
router.post('/sendReqToLawyer',verifyJwt,sendReqToLawyer);
router.get('/news',verifyJwt,getKhabar);
export default router;