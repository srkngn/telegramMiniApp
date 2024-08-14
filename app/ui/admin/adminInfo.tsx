import axios from "axios";
import { useEffect,useState } from "react";

interface User {
    _id: string;
    userName: string;
    role: string;
  }

const AdminInfo = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchAdminInfo = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('/api/adminInfo',{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data)
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching admin info:', error);
            }
        }
        fetchAdminInfo();
    },[])

return (
    <div className="bg-white-200 border border-yellow-200 rounded-lg p-2 shadow-md">
    {user ? (
      <p className="text-lg font-medium text-gray-600">
        Hello, <span className="font-bold">{user.userName}</span>
      </p>
    ) : (
      <p className="text-lg font-medium text-gray-500">welcome...</p>
    )}
  </div>
    );
}

export default AdminInfo;