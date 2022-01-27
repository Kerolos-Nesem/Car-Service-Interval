const mongoose = require('mongoose');
const Service = require('./schema');

const controller = {};


controller.service = (req,res,next) =>{
    const body = req.body;
    const id = req.body.id

    Service.find({body:id}, (err,data) =>{
    
    if (err) return next('Error');
    
    console.log(id,data)

    return next();
    })
}


module.exports = controller