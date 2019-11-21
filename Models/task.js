/**
 * Task Modal
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    changeLog :  {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
})

const taskSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    start : {
        type : Date,
        required : true
    },
    end : {
        type : Date,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    logs : [logSchema]
},{timestamps:true});



const Task = mongoose.model('Task',taskSchema);

module.exports = Task;