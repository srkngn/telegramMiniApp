"use client"
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminInfo from '@/app/ui/admin/adminInfo';
import LogOutBtn from '@/app/ui/button/logOutBtn';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/studentInfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
        setUnauthorized(false); 
      } catch (error : any) {
        if (error.response?.status === 401) {
          setUnauthorized(true); 
          router.push('/'); 
        } else {
          console.error('Error fetching students:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  if (unauthorized) return <p>You are not authorized to view this page.</p>;

  return (
    <div className="container mx-auto p-4">
    <div className="flex items-center justify-between mb-6">
      <Image 
        src="/RoadToStudy/RoadToStudyLogo.png"
        alt="RoadToStudyLogo"
        width={800}
        height={600}
        className="h-16 w-auto"
      />
      <h1 className="text-2xl font-bold flex-1 text-center">
        Student Informations
      </h1>
      <div className="relative flex items-center space-x-4">
        <AdminInfo />
        <div className="relative group">
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOutBtn  />
        </div>
      </div>
    </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.firstName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


