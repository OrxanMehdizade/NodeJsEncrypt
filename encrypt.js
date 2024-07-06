


const bcrypt=require('bcrypt');
const EventEmitter=require("events");
const emitter=new EventEmitter();
const saltRounds=10;

const encryptString = async (myPlaintextPassword)=> {
    try{
        const hash= await bcrypt.hash(myPlaintextPassword.word, saltRounds);
        return hash;
    }catch(err){
        emitter.emit("logerror", `Encrypt Error: ${err.message}\n`)
    }
};


const compareString = async (originalString, hash)=>{
    try{
        const result= await bcrypt.compare(originalString, hash);
        return result;
    }catch(err){
        emitter.emit("logerror", `Compare Error: ${err.message}\n`)
    }
};

module.exports={
    encryptString,
    compareString,
};

