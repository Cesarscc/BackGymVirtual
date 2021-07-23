const Routine = require('../models/Routine');
const Exercise = require('../models/Exercise');
const {errorHandler} = require('../helpers/dberrorHandler');

exports.create = (req,res) => {
    const routine = new Routine(req.body)
    routine.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })
}

exports.list = (req,res) => {
    Routine.find().exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data});
    })
}

exports.item = (req,res, next) => {
    if (req.routine) {
        return res.send(req.routine)
    }
    next();
}

exports.remove = (req, res) => {
    let routine = req.routine
    routine.remove((err,data)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "Routine eliminada"
        });
    })

}

exports.routineById = (req, res, next, id) => {
    Routine.findById(id).exec((err, routine)=>{
        if(err || !routine){
            return res.status(400).json({
                error: "Routine no encontrada o no existe"
            })
        }
        req.routine = routine;
        next();
    })
}

exports.exercisesByIdRoutine = (req, res) => {
    let id = req.params.id;

    Routine.findById(id).exec((err, routine)=>{
        if(err || !routine){
            return res.status(400).json({
                error: "Routine no encontrada o no existe"
            })
        }

        const exs = routine.exerciseIds;
        const newexs = Array(exs.length);
        console.log(exs);
        let i = 0;
        for (i = 0; i < exs.length; i++) { 
            Exercise.findById(exs[i]).exec((err, exercise)=>{
                if(err || !exercise){
                    return res.status(400).json({
                        error: "Exercise no encontrada o no existe"
                    })
                }
                else{
                    newexs[i] = exercise;
                }
                
            })
        }       
        res.json({newexs});
    })
}

exports.routinebyuser = (req,res) => {
    let user = req.params.user;
    console.log(user);
    Routine.find({userId: user}).exec((err,data)=>{
        
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({data});
    })
}
