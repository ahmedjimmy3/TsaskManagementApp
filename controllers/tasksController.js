const Task = require('../models/tasksModel')


let addTask = async(req,res)=>{
    const userId = req.user.id
    const newTask = new Task({
        title:req.body.title,
        desc:req.body.desc,
        status:req.body.status,
        priority:req.body.priority,
        userId:userId
    })
    const savedTask = await newTask.save()
    res.status(201).json({message:"Task created successfully." , savedTask})
}

let getYourTasks = async (req,res)=>{
    const userId = req.params.id
    const queryStatus = req.query.status
    let yourTasks
    try {
        if(queryStatus){
            yourTasks = await Task.find({userId: userId , status:queryStatus})
            if(yourTasks.length == 0){
                return res.status(404).json({message:"You don't have any tasks yet."})
            }
            else{
                return res.status(200).json({yourTasks})
            }
        }
        yourTasks = await Task.find({userId:userId})
        if(yourTasks.length == 0){
            return res.status(404).json({message:"You don't have any tasks yet."})
        }
        else{
            res.status(200).json({yourTasks})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

let updateTask = async(req,res)=>{
    try {
        const taskId = req.params.id
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                $set:req.body,
            },
            { new: true }
        )
        res.status(200).json({updatedTask})
    } catch (error) {
        res.status(500).json({message:"Something went wrong."})
    }
}



let deleteTask = async(req,res)=>{
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Task deleted successfully."})
    } catch (error) {
        res.status(500).json({message:"Something went wrong."})
    }
}

let getAllTasks = async(req,res)=>{
    try {
        let allTasks;
        const queryLimit = req.query.limit
        if(queryLimit){
            allTasks = await Task.find().limit(queryLimit)
            return res.status(200).json({allTasks})
        }else{
            allTasks = await Task.find()
            return res.status(200).json({allTasks})
        }
    } catch (error) {
        res.status(500).json({message:"Something went wrong."})
    }
}

module.exports = {
    addTask,
    getYourTasks,
    updateTask,
    deleteTask,
    getAllTasks
}


