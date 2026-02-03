import { useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAuthStore } from "../../lib/store/authstore";
import nexatradeLogo from "/nexatrade-high-resolution-logo.png";
import cryptoImg from "../../assets/Cryptocurrency mining.png";
  import { useEffect } from "react";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["TRADER", "ADMIN"], { required_error: "Role is required" }),
});

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"TRADER" | "ADMIN">("TRADER");
  const [showPassword, setShowPassword] = useState(false);

  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();



useEffect(() => {
  useAuthStore.setState({ loading: false });
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse({ email, password, role });

    if (!result.success) {
      toast.error(
        Object.values(result.error.flatten().fieldErrors).flat().join(", ") ||
          "Invalid input",
      );
      return;
    }

    try {
      await signup(email, password, role);
      toast.success("Signup successful!", {
        onClose: () => navigate("/login"),
        autoClose: 1500,
      });
    } catch (error: unknown) {
      toast.error("Signup failed. Try again.");
      console.error(error);
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
            Create your NexaTrade account
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
                disabled={loading}
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

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "TRADER" | "ADMIN")}
              className="w-full p-3 mb-5 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="TRADER">Trader</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`
    w-full py-3 rounded-xl text-white transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#2239A5] hover:bg-[#132a90]"
    }
  `}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-sm text-gray-600 mt-4 text-center">
              Already have an account?{" "}
              <span
                className="text-[#2239A5] font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>

        {/* Right Section (Illustration) */}
        <div className="hidden md:flex bg-[#88BDF2] justify-center items-center">
          <img
            src={cryptoImg}
            alt="Signup Illustration"
            className="w-[80%] object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
};
