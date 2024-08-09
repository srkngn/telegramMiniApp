import { Schema,model,models } from "mongoose";

const StudentSchema = new Schema(
    {
        firstName: {type: "string", required:true},
        lastName: {type:"string", required: true},
        email:{type:"string", required: true},
        phoneNumber:{type:"string", required: true},
    },
    {
        timestamps: true
    }
 
)
const Student = models.Student || model("Student", StudentSchema)

export default Student;