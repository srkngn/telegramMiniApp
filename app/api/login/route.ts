import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../../../lib/modals/user';
import connect from '@/lib/db';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const POST = async (request: Request) => {


  try {
    const { userName, password } = await request.json();

    await connect();

    const user = await User.findOne({ userName });


    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id:user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return new NextResponse(
      JSON.stringify({ message: 'Login successful', token }),
      { status: 200 }
    );
    
    
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: 'Error handling POST request: ' + error.message }),
      { status: 500 }
    );
  }
};