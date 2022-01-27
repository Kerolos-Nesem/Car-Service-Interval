const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const PORT = 3000;
const controller = require('./controller')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/server', controller.service ,(req,res) =>{
  
//   console.log(res.locals.data)
});



const mongoURI = 'mongodb+srv://kerolos:1234@cluster0.3wdwi.mongodb.net/solo-project?retryWrites=true&w=majority'
mongoose.connect(mongoURI)
.then((data) => console.log('connected'))
.catch()

//Front end wil send back an id number based on the selection

//Back end will send back te docs with all information related

app.use((req, res) => res.status(404).send(`This is not the page you're looking for...`))

app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });
  
app.listen(PORT, () =>{
    console.log(`Server listening on port: ${PORT}`)
});
module.exports = app