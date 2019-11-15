/**
 * MailSender : function run every 1min to send notification in email
 */

const path = require('path')
const hogan = require('hogan.js');
const fs = require('fs');
const Task = require('../Models/task');
const cron = require('node-cron');
const moment = require('moment');
//nodemailer for sending mail
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


const sendMail = (task) => {
      
      const admin = task.adminId;
      const email = admin.email;
     // task.date = moment(task.date).format('DD-MM-YYYY'); //set date formate 
    //  task.time = moment(task.time).format('HH:mm');
     // task.day =  moment(task.date).weekday();

      const taskData = {
        task : task.task,
        date : moment(task.date).format('DD-MM-YYYY'), //set date formate 
        time : task.time,
        day  : moment(task.date).format('dddd')
      }

      console.log(taskData)

      //account from which we have to send email make sure use have allow permisions in account https://myaccount.google.com/lesssecureapps
      const transporter = nodemailer.createTransport(smtpTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          auth: {
          user:  "prakash.raoinfotech@gmail.com", //config.email 
          pass:  "70462071"              //config.pass //password
          }
      }));

      //template location
      const template = fs.readFileSync(path.join(__dirname,'../EmailTemplates','notifier_email.hjs'),'utf-8');
      //compile template
      const compiledTemplate = hogan.compile(template)

      // const mailOptions = req.body;   
      const mailOptions =  {
      from: 'prakash.raoinfotech@gmail.com',
      to: email,
      subject: 'Rao Information Technology',
      html : compiledTemplate.render(taskData)
      }

        //transporter which send our mail                     
        transporter.sendMail(mailOptions, function(error, info){

        if(error) return console.log(error);
    
        console.log('mail sent successfully to ',email);
       
    });

}



//send mail before hour to user 

const mailSedner = () => {  
  //second min hour day month dayofweek
  // *     *    *    *    *       *

  cron.schedule(" 0 */1 * * * *",()=> { 
        const gepOfHour = 1; //add hour 
        const timeAfterHour = moment().add(gepOfHour,'hour').format('HH:mm'); //time after hour 
        const date = moment().format('YYYY-MM-DD');
        console.log(timeAfterHour)
        Task.find({ date : date , time : timeAfterHour})
        .populate('adminId')
        .then(result=>{
          if(result.length > 0){
            result.forEach(task => {
              sendMail(task)
            })
          }
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