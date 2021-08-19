const ZKLib = require('node-zklib')
const CMD = require("../node_modules/node-zklib/constants")
const utf8 = require('utf8');

const test = async () => {


    let zkInstance = new ZKLib('192.168.18.202', 4370,10000, 4000);
    try {
        // Create socket to machine 
        await zkInstance.createSocket()
        // Get general info like logCapacity, user counts, logs count
        // It's really useful to check the status of device 
        console.log("hello")
        console.log(await zkInstance.getInfo())
        console.log("hello")
    } catch (e) {
        console.log(e)
        if (e.code === 'EADDRINUSE') {
        }
    }


    // Get users in machine 
    try{
        const users = await zkInstance.getUsers()
     //   console.log("users",users)
    }
    catch(e)
    {
        console.log("Error:this is ")
    }

   try
   {
            // Get all logs in the machine 
           // Currently, there is no filter to take data, it just takes all !!
            const logs = await zkInstance.getAttendances()
       //    console.log(logs)
   }
   catch(e)
   {
       console.log("Error in get Attend")
   }

   
     try
     {
    //    const attendances = await zkInstance.getAttendances((percent, total)=>{
    //        // this callbacks take params is the percent of data downloaded and total data need to download 
    //    })
    //    console.log("attendances:",attendances)
     }
     catch(e)
     {
         console.log("error in get attend per%")
     }
     
     // YOu can also read realtime log by getRealTimelogs function //  console.log('check users', users)
     zkInstance.getRealTimeLogs((data)=>{
        // do something when some checkin 
        console.log(data)
    })



 // delete the data in machine
 // You should do this when there are too many data in the machine, this issue can slow down machine 
 //   zkInstance.clearAttendanceLog();
    
    // Get the device time
 //   const getTime = await zkInstance.getTime();
	//	  console.log(getTime.toString());

    // Disconnect the machine ( don't do this when you need realtime update :))) 
  //  await zkInstance.disconnect()
//   async function executeCmd(command, data=''){
//       try{
//         console.log(command,":",data)
       
//         let abc= await zkInstance.functionWrapper(
//             ()=> zkInstance.zklibTcp.executeCmd(command, data),
//             ()=> zkInstance.zklibUdp.executeCmd(command , data)
//         )
//         console.log("excute command:",abc)
        
//       }
//       catch(e)
//       {
//           console.log("Error",e)
//       }
// }

//executeCmd(CMD.COMMANDS.CMD_TESTVOICE)   //test voice
 await zkInstance.executeCmd(CMD.COMMANDS.CMD_REG_EVENT) 
}

test()


 
