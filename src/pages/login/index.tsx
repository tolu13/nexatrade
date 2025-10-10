import { useState } from "react"
import crypto from "../../assets/Cryptocurrency mining.png"
import nexatrade from "/nexatrade-high-resolution-logo.png"
import {z} from "zod"
import { useAuthStore } from "../../lib/store/authstore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PiEye, PiEyeClosed } from "react-icons/pi";

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  });

export const LoginPage = () =>   {

const [email, setEmail] =  useState('')
const [password, setPassword] = useState('')
const [showPassword, showSetPassword] = useState(false)
const {login} = useAuthStore();
const navigate = useNavigate();

const  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      // Handle validation errors
      console.log(result.error.format());
      return;
    }
    await login(email, password);
    toast.success('Login successful', {
        onClose: () => navigate('/dashboard'),
        autoClose: 1500, // Adjust time as needed
      });
}

return (<div className="flex bg white w-full min-h-screen overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-3 bg-[#BDDDFC] w-full  p-4 md:p-10 m-8 md:m-10 rounded-2xl">
    <div className="bg-inherit rounded-l-4xl w-full">
    <img src={nexatrade} alt="logo" className="w-55 h-45 mb-3 mix-blend-multiply object-contain justify-start"/>
        <form onSubmit = {handleSubmit} >
            <h3 className="text-3xl text-[#6A89A7] text-balance text-center mb-8">Welcome back input your details to login </h3>
            <input type="email" value={email} onChange={(e) => setEmail (e.target.value)} placeholder="email" className="bg-white mt-9 border-2 max-w-sm py-3 px-3 w-full rounded-2xl placeholder:text-[#384959]" />
            <div className="relative">
            <input  type={showPassword ? 'text': 'password'} value={password} onChange={(e) => setPassword (e.target.value)} placeholder="password" className="bg-white mt-7 border-2 max-w-sm py-3 px-3 w-full rounded-2xl placeholder:text-[#384959]"/>
            <span
            className="absolute md:right-28 bottom-4 right-[26px] "
            onClick={() => showSetPassword((prev) => !prev )}
            >
            {showPassword? <PiEye/> :  <PiEyeClosed />}
            </span>
            </div>
            

            <button className="px-3 py-3 mt-5 bg-[#2239A5] w-full max-w-sm rounded-2xl text-white hover:border-blue-700 hover:cursor-pointer" type="submit">Login</button>
        </form>

    </div>
    <div className="md:block hidden md:col-span-2 bg-[#88BDF2] rounded-r-4xl relative overflow-hidden ">
    <div className="flex justify-center items-center  p-5 mr-14 mt-4">
    <img src={crypto} alt="a man investing" className="w-[650px] object-contain rounded-[10%] shadow-lg items-center"/>
    </div>

    
    
    </div>
    </div>
</div>
)
}
