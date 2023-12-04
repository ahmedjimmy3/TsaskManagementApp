const Audit = require('../models/auditTrailModel')

const auditTrail = ()=>{

}


auditTrail.logTrail = (trail)=>{
    try{
        const newTrail = new Audit(trail)
        newTrail.save()
    }catch(err){
        console.log(err)
    }
}


module.exports = auditTrail