import cron from "node-cron";
import { Student } from "../models/studentModel";

export const initScheduler=()=>{
    cron.schedule('0 0 2 * *' ,async ()=>{
        try{
            const result=await Student.updateMany(
                {isFeesPending:false},
                {$set:{isFeesPending:true}}
            );
            console.log(`Scheduler ran successfully. Modified count: ${result.modifiedCount}`);
        }
        catch(err){
            console.error("error updating", err);
        }
    });
    console.log("Cron job initialized");
}



