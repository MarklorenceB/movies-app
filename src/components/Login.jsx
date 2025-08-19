import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../appwrite.auth"; // ✅ make sure this exports the Account instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Check if there's already a session
      await account.deleteSession("current").catch(() => {});

      // ✅ Create new session
      await account.createEmailPasswordSession(email, password);

      // ✅ Redirect to home
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
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

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
