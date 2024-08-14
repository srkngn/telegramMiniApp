import { NextRequest, NextResponse } from 'next/server';
import User from '../../../lib/modals/user'; 
import connect from '@/lib/db';
import argon2 from 'argon2';
import { requireAdmin } from '@/utils/authMiddleware';

export const POST = async (req: NextRequest) => {
  const adminAuthResponse = requireAdmin(req);

  if (adminAuthResponse) return adminAuthResponse;
  
  try {
    const formData = await req.json();
    const { userName, password, role } = formData;

    // Form alanlarının zorunlu olduğunu kontrol et
    if (!userName || !password || !role) {
      return new NextResponse(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    await connect(); // Veritabanına bağlanın

    // Kullanıcının zaten var olup olmadığını kontrol edin
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400 }
      );
    }

    // Yeni kullanıcıyı oluşturun ve kaydedin
    const newUser = new User({
      userName,
      password, // Burada şifreyi hash'leyin
      role
    });

    await newUser.save(); // Kullanıcıyı veritabanına kaydedin

    return new NextResponse(
      JSON.stringify({ message: 'User created successfully' }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error handling POST request: ' + error.message }),
      { status: 500 }
    );
  }
}