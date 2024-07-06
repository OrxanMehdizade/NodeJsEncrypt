const http=require("http");
const EventEmitter=require("events");
const emitter=new EventEmitter();
const encrypt=require("./encrypt");
const fs = require("fs");

emitter.on("logerror",(errorMessage)=>{
    const logMessage=`[${new Date().toISOString()}] Error: ${errorMessage}\n`;
    fs.appendFile("errorlog.txt",logMessage,(err)=>{
        if(err)throw err;
        console.log("Error logged to errorlog.txt");

    });

});

emitter.on("myEncryptString", async (data)=>{
    try{
        const item= await encrypt.encryptString(data);
        console.log(item);
    }catch(error){
        emitter.emit("logerror",`Encrypt Error: ${error.message}\n`);
    }
});

emitter.on("myCompareString", async (data)=>{
    try{
        const {originalString, hash}=data;
        const item= await encrypt.compareString(originalString, hash);
        console.log(item);
    }catch(error){
        emitter.emit("logerror",`Compare Error: ${error.message}\n`);
    }
});



const server= http.createServer((req,res)=>{
    if(req.method === "POST" && req.url === "/MyEncrypt"){
        let body ="";
        req.on("data",(item)=>{
            body = item.toString();
        });
        req.on("end",()=>{
            const data=JSON.parse(body);
            emitter.emit("myEncryptString",data);
            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(JSON.stringify({status:"success"}));
        })
    } 
    else if(req.method === "POST" && req.url === "/MyCompare"){
        let body ="";
        req.on("data",(item)=>{
            body+=item.toString();
        });
        req.on("end",()=>{
            const data=JSON.parse(body);
            emitter.emit("myCompareString",data);
            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(JSON.stringify({status:"success"}));
        })
    }
    else{
        emitter.emit("logerror", "Endpoint Error");
        res.writeHead(404);
        res.end();
    }
});

server.listen(5000,()=>{
    console.log("Server is running on port 5000");
});