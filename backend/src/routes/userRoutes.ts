import { Router } from "express";
import { postLawyerFillUp, postLogin, postSignup } from "../controllers/UserController";
const router=Router();

router.get('/',(req,res)=>{
    res.json("inside route 1");
})
// router.get('/login')

router.post('/login',postLogin);
router.post('/SignUp',postSignup);
router.post('/LaywerFillUp',postLawyerFillUp)
export default router;