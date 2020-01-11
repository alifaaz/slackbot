import mongoose from 'mongoose'



mongoose.set('debug', true);
/**
 * connect to db
 *
 * @return {object} - connection object
 * @public
 */


export default () => {
    mongoose.connect("mongodb://localhost:27017/serverMonitored", {
		/**
	 * @keepAlive - to send packet every 120ms to checkk conectivity
	 * @poolSize - number of socket to run operation on dbs
	 * @reconntTries - number of tried connection after its drop
	 * @reconnctInterval - time by ms of try to connect when its drop
	 */
     useUnifiedTopology: true ,
        useNewUrlParser: true,
        keepAlive: 120,
        poolSize: 10,
    
        reconnectInterval: 500,
        useFindAndModify: false,

    });
    return mongoose.connection;
};