const mongoose = require('mongoose');
const service = require('./schema');
const controller = {};


controller.service = (req,res,next) =>{
    console.log(req.body.id)
    service.find(req.body,(err,ser)=>{
        
    if (err) return next('Error');
    console.log(ser)
    return next();
    })
}


module.exports = controller