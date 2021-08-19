const express=require("express");
const router=express.Router();
require("../src/db/connection");
const bcrptjs=require("bcryptjs");
const user_Collection=require("../src/db/user")
const settings_Collection=require("../src/db/settings")
const attendance_log_Collection=require("../src/db/attendances_log")
const attendance_Record=require("../src/db/attendances_record");
const ZKLib = require('node-zklib')
router.post("/user",async (req,res)=>{
       user_Collection.findOneAndUpdate({userId:req.body.id},{ salary:parseInt(req.body.salary),shift:req.body.shift})
       .then(()=>{res.status(201).json({message:"user updated"})})
       .catch((e)=>{console.log("error",e)})       
})
router.get("/user",async (req,res)=>{
                try
                {
                    const users = await  user_Collection.find();
                    console.log("users",users)
                   res.status(201).json({message:users})
                }
                catch(e)
                {
                    console.log("Error while getting users")
                }    
})
router.post("/users",async (req,res)=>{
    let zkInstance = new ZKLib('192.168.18.202', 4370,10000, 4000);
                try {
                    await zkInstance.createSocket();
                    console.log(await zkInstance.getInfo())
                } catch (e) {console.log(e);}
                try
                {
                    const users = await zkInstance.getUsers()
                    const del=await user_Collection.deleteMany();
                user_Collection.insertMany(users.data).then(()=>{ res.status(201).json({message:"Users Added Successfully"});}).catch((e)=>{  res.status(500).json({message:'server error!!'},e)})
                }
                catch(e)
                {
                    console.log("Error")
                }    
})
router.post("/settings",async (req,res)=>{
                try
                {  
                    let count=await settings_Collection.find().countDocuments();
                    if(count>=1) await settings_Collection.deleteMany()
                   await settings_Collection.insertMany([req.body]); res.status(201).json({message:"Settings Added Successfully"});
                }
                catch(e)
                {
                    res.status(500).json({message:'error!!'})
                }    
})
router.get("/settings",async (req,res)=>{
    try
    {  
        let data=await settings_Collection.find();
        console.log(data)
         res.status(201).json({message:data[0]});
    }
    catch(e)
    {
        res.status(500).json({message:'error!!'})
    }    
})
router.get("/dashboard/:date1/max/:date2",async (req,res)=>{
    try
    {
        let count=await attendance_Record.find({date: {$gte:new Date(req.params.date1),$lte:new Date(req.params.date2)}}).countDocuments();
        let late=await attendance_Record.find({date: {$gte:new Date(req.params.date1),$lte:new Date(req.params.date2)},late:true}).countDocuments();
        const users = await  user_Collection.find().countDocuments();
        var graph=[];
        for(let i=4;i>=0;i--)
        {
            var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            d1=new Date((new Date().getTime() - (i * 24 * 60 * 60 * 1000)))
            d=`${d1.getDate()} ${month[d1.getMonth()]}`;
            d1=`${d1.getFullYear()}-${month[d1.getMonth()]}-${d1.getDate()}`;

            d2=new Date((new Date(d1).getTime() + (1 * 24 * 60 * 60 * 1000)))
            d2=`${d2.getFullYear()}-${month[d2.getMonth()]}-${d2.getDate()}`;
            let count=await attendance_Record.find({date: {$gte:new Date(d1),$lte:new Date(d2)}}).countDocuments();
            let late=await attendance_Record.find({date: {$gte:new Date(d1),$lte:new Date(d2)},late:true}).countDocuments();
            graph.push({date:d,check_in:count,late:late})
        }
        console.log(graph)
        res.status(201).json({message:{check_in:count,late:late,users:users,graph:graph}});
    }
    catch(e)
    {
        console.log("error")
    }
})
router.post("/attendance_log",async (req,res)=>{
                let zkInstance = new ZKLib('192.168.18.202', 4370,10000, 4000);
                try {
                   await zkInstance.createSocket() 
                   let info=await zkInstance.getInfo();
                   if(info.logCounts==0) {res.status(201).json({message:false});return}
                } catch (e) {console.log('device not connected');}
                try    
                {
                    const attendances = await zkInstance.getAttendances();  
                    await zkInstance.clearAttendanceLog();
                    console.log(attendances.data)
                    attendance_log_Collection.insertMany(attendances.data).then(()=>{ res.status(201).json({message:"Attendance log Added Successfully"});}).catch((e)=>{  res.status(500).json({message:'server error!!'})})        
                }
                catch(e)
                {
                    console.log("Error")
                }    
})
router.get("/attendance_record/:date1/max/:date2",async(req,res)=>{
    try
    {
        let data=await attendance_Record.find({date: {$gte:new Date(req.params.date1),$lte:new Date(req.params.date2)}});
       // console.log(data)
        if(data)
        {
            data=JSON.stringify(data)
            res.status(201).json({message:data});
        }
        else
        res.status(201).json({message:"data not found"});
    }
    catch(e)
    {
        console.log("error")
    }
})
router.get("/attendance_log/:date1/max/:date2",async(req,res)=>{
    try
    {
              let data=await attendance_log_Collection.find({recordTime: {$gte:new Date(req.params.date1),$lte:new Date(req.params.date2)}});
              if(data)
                {
                    var arr=[]; var x=0;
                    var break_arr=[]; var b=0;
                    var previous_data=[]; var p=0;
                    for (let i=0;i<data.length;i++)
                    {
                        var temp=data[i];
                        var temp_arr=[]; var t=0; var id;
                        var count=0; //count already exit data
                        for(let j=0;j<previous_data.length;j++)
                        {
                            if(previous_data[j]==temp.deviceUserId)
                            {count++;break;}
                        }
                        if(count!=0) continue;
                        for (let j=0;j<data.length;j++)
                        {
                            if(temp.deviceUserId==data[j].deviceUserId)
                            {
                                temp_arr[t]=data[j];t++;id=temp.deviceUserId;
                            }
                            previous_data[p++]=id;
                        }
                         // 
                         let In=new Date(temp_arr[0].recordTime);
                
                         let shift_time=await settings_Collection.find();
                         var user=await user_Collection.find({userId:temp_arr[0].deviceUserId},{shift:1}).limit(1);
                         console.log(user[0].shift)
                         if(user[0].shift=='Morning')
                         var late=(new Date('1/1/1999 '+ `${In.getHours()}:${In.getMinutes()}`)> new Date( '1/1/1999 '+ shift_time[0].morning[0][1]))
                         else if(user[0].shift=='Evening')
                         var late=(new Date('1/1/1999 '+ `${In.getHours()}:${In.getMinutes()}`)> new Date( '1/1/1999 '+ shift_time[0].evening[0][1]))
                         else
                         var late=(new Date('1/1/1999 '+ `${In.getHours()}:${In.getMinutes()}`)> new Date( '1/1/1999 '+ shift_time[0].night[0][1]))
                         // 
                        if(temp_arr.length==1)
                         { arr[x]= {id:id,entry:Dte(temp_arr[0].recordTime),leave:'-',working:[temp_arr[0].recordTime],late:late,shift:user[0].shift};x++}
                         else if(temp_arr.length==2)
                            {
                                arr[x]= {id:id,entry:Dte(temp_arr[0].recordTime),leave:'-',working:[temp_arr[0].recordTime],late:late,shift:user[0].shift};
                                arr[x].leave=Dte(temp_arr[temp_arr.length-1].recordTime); 
                                arr[x].working[1]=temp_arr[temp_arr.length-1].recordTime;
                                x++;
                            } 
                   if (temp_arr.length>2)
                   {
                    arr[x]= {id:id,entry:Dte(temp_arr[0].recordTime),leave:'-',working:[temp_arr[0].recordTime],late:late,shift:user[0].shift};
                    arr[x].leave=Dte(temp_arr[temp_arr.length-1].recordTime); 
                    arr[x].working[1]=temp_arr[temp_arr.length-1].recordTime; x++;
                       temp_arr.pop();
                       temp_arr.shift();
                       for(let z=0;z<temp_arr.length;z++)
                       {
                       
                            if(z%2!=0){
                            for(let j=break_arr.length-1;j>=0;j--)
                                if(temp.deviceUserId==break_arr[j].id)
                                  {break_arr[j].leave=Dte(temp_arr[z].recordTime);
                                   break_arr[j].working[1]=temp_arr[z].recordTime;
                                   break;
                                   }
                            }
                            else {
                                break_arr[b]= {id:temp_arr[z].deviceUserId,entry:Dte(temp_arr[z].recordTime),leave:'-',working:[temp_arr[z].recordTime]};b++;                
                            }
                            
                       }
                   }
                    }
                    var result=[];
                    for(i in arr)
                    {
                        let inc=i;
                        let name=await user_Collection.find({userId:arr[i].id}).limit(1);
                        let work=working_hours(arr[i].working);
                        let result2=breaks(arr[i].id,work);
        result.push({id:`${arr[i].id}`,name:`${name[0].name}`,entry:`${arr[i].entry}`,leave:`${arr[i].leave}`,work:`${result2._work}`,late:`${arr[i].late}`,shift:`${arr[i].shift}`,break:`${result2._break}`,data:[JSON.stringify(result2.breaks)],date:arr[i].working[0]});
                    }
              //    console.log("result:",JSON.stringify(result))
                    function breaks(id,work)
                    {
                        var breaks=[]
                        var break_hours=[];
                        for(j in break_arr)
                       {
                           if(id==break_arr[j].id){
                            let free=working_hours(break_arr[j].working);
                            break_hours.push(free)
                            breaks.push({leave:`${break_arr[j].entry}`,back:`${break_arr[j].leave}`,total:`${free.hr} hr ${free.min} min`})
                           }           
                       }
                       break_hours=break_time(break_hours,work);
                     
                       let _work=`${break_hours[1].hr} hr ${break_hours[1].min} min`
                       let _break=`${break_hours[0].hr} hr ${break_hours[0].min} min`
                      
                      return {breaks,_break,_work};
                    }
                await attendance_Record.deleteMany({date: {$gte:new Date(req.params.date1),$lte:new Date(req.params.date2)}});
                attendance_Record.insertMany(result).then(()=>{ res.status(201).json({message:"Added Successfully"});}).catch((e)=>{  res.status(500).json({message:'server error!!'},e)})
             console.log(result)
                }       
    }
    catch(err)
    {
        console.log("Error",err)
    }
})

function Dte(attendance)
{
    var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    var date=new Date(attendance);    
    const time=()=>{
        let date=new Date(attendance);
        let hr=date.getHours();
        let min=date.getMinutes();
        let m=(hr>11)?'PM':"AM";
        hr= (hr>11)?hr-12:hr;
        min=(min<10)?'0'+min:min;
        return `${hr}:${min} ${m}`;
        }
        return `${day[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]}, ${time()}`;
}
check_timing=async (time1)=>
{
    let date=new Date(time1);
    let time=await settings_Collection.find();
    time=(new Date('1/1/1999 '+ `${date.getHours()}:${date.getMinutes()}`)> new Date( '1/1/1999 '+ time[0].morning[0][1]))
    return time
}
function working_hours(working)
{
    if(working.length==2)
    {
        let x=new Date(working[0]);
        let y=new Date(working[1]);
        let hr1=x.getHours();
        let hr2=y.getHours();
        let min1=x.getMinutes();
        let min2=y.getMinutes();
        hr1= (hr1>11)?hr1-12:hr1;
        hr2= (hr2>11)?hr2-12:hr2;
        min1=(min2<10)?'0'+min1:min1;
        min2=(min2<10)?'0'+min2:min2;
        let total_hrs=hr2-hr1;
        total_hrs= (total_hrs==0)? total_hrs : --total_hrs;
        total_hrs=(total_hrs<0)? 12+ total_hrs: total_hrs;
        let total_mins;
        if(hr1==hr2) total_mins=min2-min1;
        else
        total_mins=parseInt(min2)+parseInt((60-min1));
        console.log(total_hrs,":",total_mins)
        if(total_mins>=60) { 
            ++total_hrs;
            total_mins-=60;
        }
        return {hr:`${total_hrs}`,min:`${total_mins}`};
    }
    else return {hr:`-`,min:`-`}
}
function break_time(arr,work)
{

    console.log("value:",arr) //break arr
    console.log("work:",work) // work arr
  // if(arr.length==1 && work.hr!='-') return [{hr:arr[0].hr,min:arr[0].min},{hr:work.hr,min:work.min}]
    if(arr.length==0 && work.hr=='-') return [{hr:'-',min:'-'},{hr:'-',min:'-'}]
    else if(arr.length==0 && work.hr!='-') return [{hr:'-',min:'-'},{hr:work.hr,min:work.min}]
    for(let i=0;i<arr.length;i++)
        if(arr[i].hr=='-' || arr[i].min =='-')
        return [{hr:'-',min:'-'},{hr:work.hr,min:work.min}]
    while(true)
    {
     //   if(arr.length==1){arr.push({hr:0,min:0}); break;}
        if(arr.length==1 && work.hr!='-') {arr.push({hr:arr[0].hr,min:arr[0].min});arr.shift();break;}
        let hr=parseInt(arr[0].hr) + parseInt(arr[1].hr);
        let min=parseInt(arr[0].min) +parseInt(arr[1].min);
        if(min>=60) {min=min-60;hr++}
        arr.shift()
        arr.shift()
        arr.push({hr:hr,min:min})
    }
    arr=arr[0]
    if(true)
    {
        let hr=parseInt(work.hr) - parseInt(arr.hr);
        let min=parseInt(work.min) - parseInt(arr.min);
        if(min<0) {min=60+min;hr--}
        work={hr:hr,min:min}
    }
    return [arr,work];
}
module.exports = router; 