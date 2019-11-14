/**
 * MailSender : function run every 1min to send notification in email
 */

const path = require('path')
const hogan = require('hogan.js');
const fs = require('fs');
const Task = require('../Models/task');
const cron = require('node-cron');
const moment = require('moment');

//send mail before hour to user 

const mailSedner = (req,res,next) => {  
  //second min hour day month dayofweek
  // *     *    *    *    *       *
  
  cron.schedule(" */20 * * * * *",()=> { 
        const gepOfHour = 1; //add hour 
        const timeAfterHour = moment().add(gepOfHour,'hour').format('HH:mm'); //time after hour 
        const date = moment().format('YYYY-MM-DD');
        console.log(timeAfterHour)
        Task.find({ date : date , time : timeAfterHour})
        .populate('adminId')
        .then(result=>{
          console.log(result)
        })
        .catch(err=>{
          console.log(err)
        })
    

      })
}


module.exports = mailSedner;


/**
 * 
 *  const date = new Date();
        const currentTime1 = `${date.getHours() + 1}:${date.getMinutes() < 10 ?`0${date.getMinutes()}`:date.getMinutes()}`
        console.log(currentTime1)
 * 
 * 
 * 
 */