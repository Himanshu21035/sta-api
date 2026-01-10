import { Schema, model, Document } from "mongoose";


export interface student extends Document {
	name:string,
	regNum: string,
	batchStart:string,
	batchEnd:string,
	DateOfJoin: Date,
	Course: string,
	FatherName: string,
	Address: string,
	PhonePrimary: string,
	PhoneSecondary?: string,
	dob:Date,
	HighestQualification: string,
	Email: string,
	Fees: Number
	isCertified: boolean,
	isCompleted:boolean,
	isDeleted:boolean,
	isFeesPending: boolean, 
	isActive?:boolean,
};

const studentSchema=new Schema<student>({
	name:{type:String, required:[true,'Name is required'] ,trim:true, maxlength:100},
	regNum:{type:String, required:[true,'Registration number is required'], unique:true, index:true, uppercase:true, trim:true},
	batchStart:{type:String, required:[true, 'Batch start date is required']},
	batchEnd:{type:String, required:[true, 'Batch end date is required']},
	DateOfJoin:{type:Date, required:[true, 'Date of joining is required'], default: Date.now()},
	Course:{type:String, required:[true, 'Course is required'], trim:true},
	FatherName:{type:String, required:[true, "Father's name is required"], maxlength:100, trim:true},
	Address:{type:String, required:[true, 'Address is required'], maxlength:250, trim:true},
	PhonePrimary:{type: String, required:[true, 'Primary phone is required'], match:[/^[6-9]\d{9}$/,'Invalid phone number'] },
	PhoneSecondary:{type: String, match:[/^[6-9]\d{9}$/,'Invalid phone number']},
	dob:{type:Date, required: [true, 'Date of birth is required'], validate:{
		validator:function(value:Date){
			return value<new Date();
		},
		message:'DOB must be in the past'
	}},
	HighestQualification:{type:String, required:[true, 'Highest qualification is required'], trim :true},
	Email:{type:String, required:[true, 'Email is required'], unique:true, match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'], lowercase:true, trim:true},
	Fees:{type:Number, required:true},
	isCertified:{type:Boolean, default:false},
	isCompleted:{type:Boolean, default:false},
	isDeleted:{type:Boolean, default:false},
	isFeesPending:{type:Boolean, default:true},
	isActive:{type:Boolean, default: true}
}, {timestamps:true});

studentSchema.index({DateOfJoin:1, Course:1});

export const Student=model<student>('Student', studentSchema);



