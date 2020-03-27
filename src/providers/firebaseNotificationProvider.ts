import request from "request-promise";
import dotenv from "dotenv";
import logger = require('./../utils/logger');

dotenv.config();

export const pushNotificationViaFcmToken = async (token: string, details: any) => {
    // const key = process.env.FCM_SERVER_KEY;
    // const url = `https://fcm.googleapis.com/fcm/send`;
    // const response = await request(url);
    // return JSON.parse(response);

    try {
        if (token != null) {
            let epochId = +Math.round(Date.now() / 1000) ;
            var request_data = {
                to: token,
                collapse_key: "type_a",
                notification: {
                    body: details.body,
                    title: details.title,
                    mutable_content: true,
                    'content-available': true
                },
                data: {
                    body: details.body,
                    description: details.body,
                    title: details.title,
                    shouldSave: 1,
                    id: epochId,
                    date: String(epochId),
                    key_1: "testKey"
                }
            }
            //deeplink:"https://mytm.telenor.com.mm/thinGyan-instant",
            // 
            await request.post({
                headers: {
                    'Authorization': 'Bearer ' + process.env.FCM_SERVER_KEY,
                    'content-type': 'application/json'
                },
                proxy: (process.env.APP_ENV === 'production') ? 'http://10.84.93.11:9090' : '',
                url: `https://fcm.googleapis.com/fcm/send`,
                body: JSON.stringify(request_data)
            }, (error, response, body) => {
                if (error) logger.error(error);

                if (response && response.statusCode == 200) {
                    return 'success'
                } else {
                    return 'failed'
                }
            });
        }
    } catch (e) {
        //console.log(e)
        logger.error(e);
    }
};