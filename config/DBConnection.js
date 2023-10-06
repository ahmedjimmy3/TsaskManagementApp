const mongoose = require('mongoose')

const connectionDB = ()=>{
    mongoose.connect(process.env.DBURL)
    .then(()=>{
        console.log('Db connected')
    })
    .catch(()=>{
        console.log('Db not connected')
    })
}

module.exports = connectionDB