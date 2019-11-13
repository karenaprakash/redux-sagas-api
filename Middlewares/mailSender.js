/**
 * MailSender : function run every 1min to send notification in email
 */

const path = require('path')
const hogan = require('hogan.js');
const fs = require('fs');

const cron = require('node-cron');

const mailSedner = (req,res,next) => {
    cron.schedule("0 */1 * * * *",()=> {
        console.log("logs every minute")
      })
}


module.exports = mailSedner;