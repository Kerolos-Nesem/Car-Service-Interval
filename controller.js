const mongoose = require('mongoose');
const Service = require('./schema');

const controller = {};


controller.service = (req,res,next) =>{
    const body = req.body;
    const id = req.body.id;
    
    
    Service.find({}, (err,data) =>{
    
    if (err) return next('Error');
    
    

        const filter = data.filter(el =>{

                if(Number(id) === el.id){
                    return true
                }
            
        })
    
        res.locals.service = filter
    return next();
    })
}


module.exports = controller