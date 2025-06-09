import { Router } from "express";
import { postLawyerFillUp, postLogin, postSignup } from "../controllers/UserController";
import { verifyJwt } from "../middlewares/verifyJWT";
const router=Router();

router.get('/',(req,res)=>{
    res.json("inside route 1");
})
// router.get('/login')

router.post('/login',postLogin);
router.post('/SignUp',postSignup);
router.post('/LaywerFillUp',verifyJwt,postLawyerFillUp);
export default router;