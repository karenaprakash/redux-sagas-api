/**
 * Task Modal
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    adminId : {
        type : Schema.Types.ObjectId,
        ref : 'Admin',
        required: true
    }
},{timestamps:true});

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;