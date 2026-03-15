import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

function Login() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      /* -----------------------------
         BACKEND LOGIN
      ----------------------------- */

      const res = await axios.post(`${API}/auth/login`, {
        email,
        password
      });

      const token = res.data?.token || res.data?.accessToken;

      if (token) {

        localStorage.setItem("token", token);

        console.log("✅ Backend login success");

        navigate("/");

        return;

      }

      throw new Error("Token missing");

    } catch (err) {

      console.log("⚠️ Backend login failed → fallback login activated");

      /* -----------------------------
         FALLBACK LOGIN
      ----------------------------- */

      setTimeout(() => {

        if (email === "test@example.com" && password === "123456") {

          localStorage.setItem("token", "mock-token");

          console.log("✅ Fallback login success");

          navigate("/");

        } else {

          setError("Invalid email or password");

        }

        setLoading(false);

      }, 800);

      return;

    }

  };


  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-500 items-center justify-center">
        <h1 className="text-white text-5xl font-extrabold p-10 text-center">
          Welcome Back! <br /> Let's save lives together 🚑
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100">

        <div className="bg-white rounded-3xl shadow-2xl p-10 w-11/12 max-w-md transform transition-transform duration-300 hover:scale-105">

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white text-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {error && (
            <p className="text-red-500 text-center mt-4">
              {error}
            </p>
          )}

          <p className="text-center text-gray-500 mt-6">
            Use <strong>test@example.com / 123456</strong> if backend unavailable.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;