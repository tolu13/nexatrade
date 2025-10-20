import { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAuthStore } from "../../lib/store/authstore";
import { AxiosError } from "axios";
import nexatradeLogo from "/nexatrade-high-resolution-logo.png";
import cryptoImg from "../../assets/Cryptocurrency mining.png";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      toast.error(result.error.errors[0]?.message || "Invalid credentials", {
        autoClose: 3000,
      });
      return;
    }

    try {
      await login(email, password);
      toast.success("✅ Login successful", {
        onClose: () => navigate("/dashboard"),
        autoClose: 1500,
      });
    } catch (error: unknown) {
      let message = "❌ Login failed. Please check your email or password.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      }

      toast.error(message, { autoClose: 3000 });
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#BDDDFC] justify-center items-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left Section (Form) */}
        <div className="flex flex-col justify-center items-center p-8 md:p-12">
          <img
            src={nexatradeLogo}
            alt="NexaTrade Logo"
            className="w-40 mb-6 mix-blend-multiply"
          />
          <h2 className="text-2xl font-semibold text-[#2239A5] mb-6 text-center">
            Welcome back! Log in to your account
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <input
              type="email"
              value={email}
              placeholder="Email"
              className="w-full p-3 mb-4 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <PiEye /> : <PiEyeClosed />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2239A5] text-white rounded-xl hover:bg-[#132a90] transition"
            >
              Login
            </button>

            <p className="text-sm text-gray-600 mt-4 text-center">
              Not signed up yet?{" "}
              <span
                className="text-[#2239A5] font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>

        {/* Right Section (Illustration) */}
        <div className="hidden md:flex bg-[#88BDF2] justify-center items-center">
          <img
            src={cryptoImg}
            alt="Login Illustration"
            className="w-[80%] object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
};
