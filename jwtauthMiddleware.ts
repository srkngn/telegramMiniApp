import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function jwtauthMiddleware(req: NextRequest){
    const token= req.headers.get('Authorization')?.replace('Bearer','').trim();

    if(!token) {
        return new NextResponse(
            JSON.stringify({message:'No token provided'}),
            {
                status:401
            }
        )
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET) as {role: string};

        (req as any).user=decoded;
        return undefined;
    }catch(error: any){
        return new NextResponse(
            JSON.stringify({ message: 'Invalid token' }),
            { 
                status: 401
            }
          );
    }
}