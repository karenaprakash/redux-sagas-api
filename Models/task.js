/**
 * Task Modal
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    task : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required : true
    },
    adminId : {
        type : Schema.Types.ObjectId,
        ref : 'Admin',
        required: true
    }
},{timestamps:true});

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;