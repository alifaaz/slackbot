import express,{Router} from 'express'
import Controllers from "../contollers/intractiveResponse";
const router = Router()


router.route("/slack/act").post(Controllers.intractiveResponse)


export default router
