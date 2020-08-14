import request from "request-promise";
import dotenv from "dotenv";
import logger = require('./../utils/logger');
import filelogger = require('./../utils/filelogger');

dotenv.config();

export const pushNotificationViaFcmToken = async (token: any, details: any) => {
    // const key = process.env.FCM_SERVER_KEY;
    // const url = `https://fcm.googleapis.com/fcm/send`;
    // const response = await request(url);
    // return JSON.parse(response);

    try {
        if (token != null) {
            let epochId = +Math.round(Date.now() / 1000);
            var request_data = null;
            if(token.platform === 'ios'){
                request_data = {
                    to: token.fcm_token,
                    collapse_key: "type_a",
                    data: {
                        body: details.body,
                        description: details.body,
                        title: details.title,
                        shouldSave: (typeof(details.isSave) != "undefined") ?parseInt(details.isSave):1,
                        id: epochId,
                        date: String(epochId),
                        deeplink: details.link,
                        banner: {
                            img: details.banner
                        }
                    },
                    notification: {
                        body: details.body,
                        title: details.title,
                        mutable_content: true,
                        'content-available': true
                    }
                }

                if(typeof(details.isSave) != "undefined" && parseInt(details.isSave) === 0){
                    delete request_data.data.id;
                    delete request_data.data.date;
                }
            }else{
                request_data = {
                    to: token.fcm_token,
                    collapse_key: "type_a",
                    data: {
                        body: details.body,
                        description: details.body,
                        title: details.title,
                        shouldSave: (typeof(details.isSave) != "undefined") ?parseInt(details.isSave):1,
                        id: epochId,
                        date: String(epochId),
                        link: details.link,
                        banner: {
                            img: details.banner
                        }
                    }
                };
            }

            //console.log(request_data);

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

                // file logger for the request
                filelogger.info(new Date().toJSON(),' - ',details.msisdn,' - ',token.device_id,' - ',token.fcm_token,' - ',token.platform, ' - ', response.statusCode,' - ',body);

                if (response && response.statusCode == 200) {
                    return 'success'
                } else {
                    return 'failed'
                }
            });

            // file logger for the request
            //filelogger.info(new Date().toJSON(),' - ',details.msisdn, ' - ',token.platform, ' - Push Body - ', JSON.stringify(request_data));
        }
    } catch (e) {
        //console.log(e)
        logger.error(e);
    }
};