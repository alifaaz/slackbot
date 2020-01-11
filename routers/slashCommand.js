import express,{Router} from 'express'
import controllers from '../contollers/slashCommand'
const router =  Router()


router.route("/slack/monitor").post(controllers.monitoredSlashCommand)


export default router


