import { useRouter } from 'next/navigation';

const LogOutBtn = () => {
    const router =useRouter();

    const handleLogOut = () => {
        localStorage.removeItem('token');
        router.push('/pages/login')
    }

    return(
        <button  onClick={handleLogOut}
        className=" px-4 py-2 bg-red-500 text-white font-semibold rounded">
            Log Out
        </button>
    )
}

export default LogOutBtn
