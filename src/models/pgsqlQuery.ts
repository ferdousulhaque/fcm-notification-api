import {Client, QueryResult} from 'pg';
import * as dbUtil from './../utils/pgsqlUtil';
import logger = require('./../utils/logger');
const transactionSuccess : string = 'transaction success';

/* 
 * sample query
 * @return server time
 */
export const getTimeModel = async () => {
    let sql = "SELECT NOW();";
    let data : string[][] = [];
    let result : QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getUserInfoModel = async (msisdn: number) => {
    let sql = "select * from account_msisdns where msisdn='"+msisdn+"'";
    let data : string[][] = [];
    let result : QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}