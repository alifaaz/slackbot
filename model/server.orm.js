import mongoose from 'mongoose'

/**
 * @ServerName     server name
 * 
 * @services tomonitor services  
 * 
 * @ipAdd ip add to montitor  ANd port number
 * 
 * @privateLocation location of private key at app's server
 * 
 * @accountNam server acount responsible for monitor services
 * 
 * @sudAcount sudo pws for monitoring account
 */

// schema for mapping my data
const ServerMonitoredSchema = new mongoose.Schema({
    ServerName   :  String,
    accountNam : String,
    services     : [String],
    ipAdd        :  String,
    privateKey   :  String,
    sudAcount:  String
})

export default mongoose.model("server",ServerMonitoredSchema)