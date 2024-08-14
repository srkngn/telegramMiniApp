import { NextRequest,NextResponse } from "next/server";
import User from "@/lib/modals/user";
import connect from "@/lib/db";
import { requireAdmin } from "@/utils/authMiddleware";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET!;

export const GET = async ( req: NextRequest) => {
    const adminAuthResponse = requireAdmin(req);

    if (adminAuthResponse) return adminAuthResponse;

    try {
        await connect();

        const token = req.headers.get('Authorization')?.split(' ')[1];
        const decoded = jwt.verify(token!, JWT_SECRET) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            return new NextResponse(
              JSON.stringify({ message: 'User not found' }),
              { status: 404 }
            );
          }
      
          if (user.role !== 'admin') {
            return new NextResponse(
              JSON.stringify({ message: 'Not authorized' }),
              { status: 403 }
            );
          }

          return new NextResponse(JSON.stringify(user), { status: 200 });

    }catch (error: any) {
        console.error('Error handling GET request:', error);
        return new NextResponse(
          JSON.stringify({ message: 'Error handling GET request: ' + error.message }),
          { status: 500 }
        );
    }

}