import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Student from '@/lib/modals/student';
import { request } from 'http';

export const GET= async () =>  {
  try {
    await connect();
    const Students = await Student.find()

    return new NextResponse(JSON.stringify(Students), {status:200});

  } catch (error : any) {
    return new NextResponse("Error handling GET request:" + error.message, {
        status: 500
    });
  }
}

export const POST = async (request: Request) => {
    try {
        const formData = await request.json();

        await connect();

        const newStudent = new Student(formData);

        await newStudent.save();

        return new NextResponse(JSON.stringify({ message: 'Student added successfully' }), { status: 201 });


    }catch(error: any){
      return new NextResponse(JSON.stringify({ message: 'Error handling POST request: ' + error.message }), {status: 500
    });
    }
}