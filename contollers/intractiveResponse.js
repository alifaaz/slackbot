import SERVER  from '../model/server.orm';
import SSH from '../hellpers/sshConnection'
import axios from 'axios';
import {INTRACTIVE_ACTION_MESSAGE} from '../hellpers/messgesCompostion';
const intractiveResponse = (req,res,next) => {

    console.log("action happen")

    // extract payload from action body
    const  payload  = JSON.parse(req.body.payload)

    // extract action from paylaod
    const action = payload.actions[0]
    
    // serverInfo embeded in action_id which is value from action
    const serverInfo = action.action_id.replace(/@/g,'').split(' ') 

    // channeId from the payload to teturn the message to the channel
    const channel = payload.channel.id

    // which action the user clicked 
    const actionValue = action.value
    const ts = action.action_ts

    // response url to send response to this url to send the notification to the user
    const { response_url } = payload
   

    // look for the server of looked services
    SERVER.findOne({ServerName:serverInfo[0]})
    .then(serverDetail => {

        // return empty eroor if there is no server ffound 
        const isEmptyData =!serverDetail
        if(isEmptyData){
            console.log("empty res")
            throw Error("server not found pls try acccessile server")
        }
       
        return serverDetail
    })
    .then(server => {

        return {ssh:SSH(server.ipAdd,server.accountNam,server.privateKey),server}

    })
    .then(async (sshServerData) => {
        // prepare ssh connection to call command
        const sshPromise = await sshServerData.ssh
    

        switch (actionValue) {
            case "start_action":
                console.log("start action")
                // console.log(serverInfo[1])
            
                // invoke start command for the services
                const sshStart = await  sshPromise.execCommand(`sudo systemctl start ${serverInfo[1]} `,{options:{pty:true},  stdin:sshServerData.server.sudAcount+"\n" })
                //check if the service is started or not 
                const sshStatus = await  sshPromise.execCommand(`systemctl is-active ${serverInfo[1]} `,{})
                
                // check if sshstatus is failed 
                if(sshStatus.stdout == "failed"){
                    const sshJournalctl =  await  sshPromise.execCommand(`journalctl -u ${serverInfo[1]}`,{})
                    const text =sshJournalctl.stdout.split('\n').filter(val => val.includes(serverInfo[1])).slice(0,10).join('\n')
                 

                    // response to inreactive message by sending post request to response_url payload
                    axios.post(response_url,INTRACTIVE_ACTION_MESSAGE({InChannel:true,channel,text,ts}))
                    return res.status(200)
                }else{
                    const text =`the serivce ${serverInfo[1]} is active now and every thinis alright on server ${serverInfo[0]} on ip address ${sshServerData.server.ipAdd}`

                    // respnse message to chanel 
                    axios.post(response_url,INTRACTIVE_ACTION_MESSAGE({InChannel:true,channel,text,ts}))
                    return res.status(200)
                }
                // const sshStatus = await  sshPromise.execCommand(`systemctl is-acive ${sshServerData.service}`,{})

                    // return res.status(200)
                break;
                case "stop_action":
                    console.log("stop actioon inkoke")
                    const sshResult = await  sshPromise.execCommand(`sudo systemctl stop ${serverInfo[1]}`,{options:{pty:true},  stdin:`${sshServerData.server.sudAcount}\n` })
                    const sshStatusStop = await  sshPromise.execCommand(`systemctl is-active ${serverInfo[1]} `,{})
                    console.log(sshStatusStop)

                    
                    if(sshStatusStop.stdout == "unknown"){
                        const text =`the serivce ${serverInfo[1]} is stoped now  on server ${serverInfo[1]} on ip address ${sshServerData.server.ipAdd}`
                        axios.post(response_url,INTRACTIVE_ACTION_MESSAGE({InChannel:true,channel,text,ts}))
                        return res.status(200)
                    }else{
                        const sshJournalctl =  await  sshPromise.execCommand(`journalctl -u ${serverInfo[1]}`,{})
                    
                         let text = sshJournalctl.stdout.split('\n').filter(val => val.includes(serverInfo[1])).slice(0,10).join('\n')
                         axios.post(response_url,INTRACTIVE_ACTION_MESSAGE({InChannel:true,channel,text,ts}))
                    return res.status(200)
                        }

                   
                break;
                case "restart_action":
                    console.log("restart invoking")
                    const sshReStart = await  sshPromise.execCommand(`sudo systemctl restart ${serverInfo[1]}`,{options:{pty:true},  stdin:`${sshServerData.server.sudAcount}\n` })
                    const sshStatusss = await  sshPromise.execCommand(`systemctl is-active ${serverInfo[1]}`,{})
                    if(sshStatusss.stdout == "failed"){
                        const sshJournalctl =  await  sshPromise.execCommand(`journalctl -u ${serverInfo[1]}`,{})
                        const text =sshJournalctl.stdout.split('\n').filter(val => val.includes(serverInfo[1])).slice(0,10).join('\n')
                        console.log(sshJournalctl.stdout.split('\n').filter(val => val.includes(serverInfo[1])).slice(0,10).join('\n'))
    
                        // response to inreactive message by sending post request to response_url payload
                        axios.post(response_url,INTRACTIVE_ACTION_MESSAGE({InChannel:true,channel,text,ts}))
                        .then(result => res.status(200))
                        .catch(err => {throw err})
                       
                    }else{
                        const text =`the serivce ${sshServerData.service} is active now and every thinis alright on server ${actionValue[0]} on ip address ${sshServerData.server.ipAdd}`
    
                        axios.post(response_url,INTRACTIVE_ACTION_MESSAGE({InChannel:true,channel,text,ts}))
                        .then(result => res.status(200))
                        .catch(err => {throw err})
                    }
                    // const sshStatus = await  sshPromise.execCommand(`systemctl is-acive ${sshServerData.service}`,{})
    
                        
                break;
        
            default:
                break;
        }

    })
    .catch(err => {
        console.log(err.message)
        return res.status(200).json({
            text:err.message
        })
    })

   


    
}


export default {intractiveResponse}