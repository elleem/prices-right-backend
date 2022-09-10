'use strict'; 
const notFound = (request,response) =>{
  response.status(404).send('sorry that page does not exist'); 
}; 


module.exports = notFound;