import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { timeStamp } from "node:console";

// export interface User extends Document {
//     userName: string;
//     Password: string;
//     comparePassword(candidatePassword:string):Promise<Boolean>;
// }

// const userSchema= new Schema<User>({
//     userName:{type: String, required:true, unique:true, lowercase:true},
//     Password:{type:String, required:true, minlength:6}
// }, {timestamps:true});

// userSchema.pre('save',async function(next){
//     if(!this.isModified('Password')) return next();
//     this.Password=await bcrypt.hash(this.Password,10);
//     next();
// });

// userSchema.methods.comparePassword= async function(candidatePassword:string){
//     return bcrypt.compare(candidatePassword,this.Password);
// };

// export const User=model<User>('User', userSchema);

export interface User extends Document{
    userName:string;
    Password:string;
    Role:string;
    comparePass(enteredPassword:string):Promise<Boolean>;
};

const userSchema=new Schema<User>({
    userName:{type:String, required:true, unique:true, lowercase: true},
    Password:{type:String, required:true, minlength:6},
    Role:{type:String, required:true, default:"Manager"},
}, {timestamps:true});

userSchema.pre('save', async function(next){
    if(!this.isModified('Password')) return next();
    this.Password=await bcrypt.hash(this.Password,10);
    next();
});

userSchema.methods.comparePass=async function(enteredPassword:string){
    return bcrypt.compare(enteredPassword,this.Password);
}
export const User=model<User>('User', userSchema);
