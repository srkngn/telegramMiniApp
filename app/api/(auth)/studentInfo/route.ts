import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Student from '@/lib/modals/student';
import { request } from 'http';
//import { jwtauthMiddleware } from '@/jwtauthMiddleware';
import { requireAdmin } from '@/utils/authMiddleware';

export const GET = async (req: NextRequest) =>  {
  
  const adminAuthResponse = requireAdmin(req);

  if (adminAuthResponse) return adminAuthResponse;

  try {
    await connect();
    const students = await Student.find();

    return new NextResponse(JSON.stringify(students), { status: 200 });
  } catch (error: any) {
    console.error('Error handling GET request:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error handling GET request: ' + error.message }),
      { status: 500 }
    );
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