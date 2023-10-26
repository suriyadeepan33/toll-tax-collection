const mongoose = require('mongoose');


const dbConnection = async () => {
    try {
        const db= await mongoose.connect('mongodb://localhost/tollTax', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('db connection successful')
    }catch(error){
        console.log(error.message)
    }
}

module.exports= dbConnection