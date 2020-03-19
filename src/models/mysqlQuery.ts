import * as dbUtil from './../utils/mysqlUtil';
import logger = require('./../utils/logger');
const transactionSuccess : string = 'transaction success';

/* 
 * sample query
 * @return server time
 */

export const checkIfExist = async (requestData: any, user_id: number) => {
    let insertsql = `INSERT INTO topup_logs_${requestData.timeStamp.substring(0, 8)} SET ?`;
    //let result : any;
    try {
        let selectsql = `SELECT id FROM topup_logs_${requestData.timeStamp.substring(0, 8)} WHERE uuid = '${requestData.uniqueTransactionId}'`;
       
        dbUtil.selectPromise(selectsql,[]).then(function(rr: any){
           let exists =  JSON.parse(JSON.stringify(rr));
           if(Object.keys(exists).length === 0){

           }
           
        }).catch(function(err){
            console.log(err);
            return 0;
        });
    } catch (error) {
        return 0;
        //throw new Error(error.message);
        logger.error(`Error: `+JSON.stringify(error));
    }
}


export const addToRechargeTable = async (requestData: any, user_id: number) => {
    try {
        let selectsql = `SELECT id FROM topup_logs_${requestData.timeStamp.substring(0, 8)} WHERE uuid = '${requestData.uniqueTransactionId}'`;
       
        await dbUtil.selectPromise(selectsql,[]).then(function(rr: any){
           let exists =  JSON.parse(JSON.stringify(rr));
           if(Object.keys(exists).length === 0){
            let insertsql = `INSERT INTO topup_logs_${requestData.timeStamp.substring(0, 8)} SET ?`;    
            let addData = {
                    user_id: user_id,
                    msisdn: requestData.msisdn,
                    price: requestData.rechargeAmount,
                    uuid: requestData.uniqueTransactionId,
                    transaction_id: requestData.uniqueTransactionId,
                }
                dbUtil.insertToDB(insertsql,addData);
                return 1;
           }else{
                logger.error(`Duplicate Entry`);
                return 2;
           }
        }).catch(function(err){
            //console.log(err);
            return 0;
        });
    } catch (error) {
        //return 0;
        //throw new Error(error.message);
        logger.error(`Error: `+JSON.stringify(error));
    }
}