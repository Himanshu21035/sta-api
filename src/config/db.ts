// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
import mongoose  from "mongoose";


export const connectDb= async()=>{
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("Database Connected");
}