import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account, ID } from "../appwrite.auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // ⏳ cooldown state
  const navigate = useNavigate();

  // ⏳ Countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Create user
      await account.create(ID.unique(), email, password, name);

      // ✅ Redirect after success
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err?.code === 429) {
        setError("Too many requests 🚦 Please wait before trying again.");
        setCooldown(30); // lock button for 30s
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create an Account ✨
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : cooldown > 0
              ? `Please wait ${cooldown}s`
              : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
