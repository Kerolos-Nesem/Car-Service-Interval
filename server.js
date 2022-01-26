const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000

app.use('/', (req,res) =>{

})
//Front end wil send back an id number based on the selection

//Back end will send back te docs with all information related
/*
{
    id: value,
    eng:[value,value,value],
    tir:[value,value,value],
    bra:[value,value,value],
    dif:[value,value,value],
    tra:[value,value,value],
    coo:[value,value,value],
    air:[value,value,value],
    cab:[value,value,value],
}
value either 1 or 0
 */

app.listen(PORT, () =>{
    console.log(`Server listening on port: ${PORT}`)
});