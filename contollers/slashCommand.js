import SERVER from '../model/server.orm'
import SSH from '../hellpers/sshConnection'
import { INTRACTIVE_FAILED_MESSAGE } from '../hellpers/messgesCompostion';
// controller fire on monitores slash command from slack
const monitoredSlashCommand =function (req,res,next) {

    console.log("slash happen")

    if(!req.body['text']){
        return res.status(200).json({"text": `error in recived request` })
    }
    // extract commands from body request commands[0] =>serverName ,command[1] => servicesName
    const comands = req.body.text.replace(/@/g,'').split(' ')  
   
    SERVER.findOne({ServerName:comands[0]})
    .then(serverData => {
        // console.log(serverData)
        const isEmptyData =!serverData
        if(isEmptyData){
            console.log("empty res")
            throw Error("server not found pls try acccessile server")
            
        }
        return serverData
    
    })
    .then( serverData => {
       
        const IndexOfService = serverData.services.indexOf(comands[1])
        console.log(IndexOfService)
        if(IndexOfService===-1){
            throw Error("no recoreded srvices found , try recorded one ")
        }

        const service = serverData.services[IndexOfService]

        return {ssh:SSH(serverData.ipAdd,serverData.accountNam,serverData.privateKey),service,serverData}


    })
    .then( async (sshh) =>{ 
        // console.log(sshh)
        const sshPromise = await sshh.ssh

        const sshResult = await  sshPromise.execCommand(`systemctl is-active ${sshh.service}`,{})

        return { sshResult,serverData:sshh.serverData }
        
}).then(sshRes => {

     if(sshRes.sshResult.stderr){
         throw Error(`${sshRes.stderr} , the service could not be found at ${sshRes.serverData.ServerName} server ip address is ${sshRes.serverData.ipAdd} service u looking for ${comands[1]} `)
     }
      
        switch (sshRes.sshResult.stdout) {
            case 'active':
                return res.status(200).json({
                    text:`the service  ${comands[1]} u looking for is active :smile: for server name ${sshRes.serverData.ServerName} and ip address is ${sshRes.serverData.ipAdd} `
                })
                break;
                case 'failed':
                 
                return res.status(200).json(INTRACTIVE_FAILED_MESSAGE( { 
                     text: `the service  ${comands[1]} u looking for is failed :ghost: for server name ${sshRes.serverData.ServerName} and ip address is ${sshRes.serverData.ipAdd}`,
                     serverData:{server:sshRes.serverData, searchService : comands[1]}}))
                break;
                case 'unknown':
                   
                return res.status(200).json(INTRACTIVE_FAILED_MESSAGE(
                    {text:`the service  ${comands[1]} u looking for is inactive  😴  for server name ${sshRes.serverData.ServerName} and ip address is ${sshRes.serverData.ipAdd} `,
                    serverData:{server:sshRes.serverData, searchService : comands[1]}}))
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

   
    // res.status(200).json({"text": `received your request. ${req.body['text'].replace(/@/g,'')}` })
  

}


export default { monitoredSlashCommand }