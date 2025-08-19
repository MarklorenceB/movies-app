import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

import { getTrendingMovies, updateSearchCount } from "./appwrite.movies.js";
import { getCurrentUser, logout } from "./appwrite.auth"; // ✅ import these

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: { accept: "application/json" },
};

// ✅ Debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
};

const App = () => {
  const navigate = useNavigate();

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Movies state
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ✅ Check session on mount
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const me = await getCurrentUser();
        if (!ignore) setUser(me);
      } finally {
        if (!ignore) setAuthLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const fetchMovies = async (searchQuery = "") => {
    setIsLoading(true);
    try {
      const endpoint = searchQuery
        ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchQuery
          )}`
        : `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setMovieList(data.results);

      if (searchQuery && data.results.length > 0) {
        const m = data.results[0];
        await updateSearchCount(searchQuery, {
          id: m.id,
          title: m.title,
          poster_path: m.poster_path, // pass raw path; builder adds full URL
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (err) {
      console.error("Error fetching trending movies:", err);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchMovies();
    loadTrendingMovies();
  }, []);

  // 🔒 Small ProtectedRoute helper
  const ProtectedRoute = ({ children }) => {
    if (authLoading) return null; // or a tiny spinner if you prefer
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <main>
              <div className="pattern" />
              <div className="wrapper">
                {/* 👇 Public nav hidden when logged in; show a minimal authed bar instead */}
                {!user ? (
                  <nav
                    style={{
                      padding: "1rem",
                      marginBottom: "2rem",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <Link to="/home" style={{ marginRight: "1rem" }}>
                      Home
                    </Link>
                    <Link to="/login" style={{ marginRight: "1rem" }}>
                      Login
                    </Link>
                    <Link to="/signup">Sign Up</Link>
                  </nav>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      marginBottom: "2rem",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <div className="text-white">
                      Welcome{user.name ? `, ${user.name}` : ""} 🎬
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-black"
                    >
                      Logout
                    </button>
                  </div>
                )}

                <header>
                  <img src="./hero.png" alt="Hero Banner" />
                  <h1>
                    Find <span className="text-gradient">Movies</span> You'll
                    Enjoy Without the Hassle
                  </h1>
                  <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </header>

                {trendingMovies.length > 0 && (
                  <section className="trending">
                    <h2>Trending Movies</h2>
                    <ul>
                      {trendingMovies.map((movie, index) => (
                        <li key={movie.id ?? index}>
                          <p>{index + 1}</p>
                          <img
                            src={movie.poster_url || movie.poster_path}
                            alt={movie.title}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="all-movies">
                  <h2>All Movies</h2>
                  {isLoading ? (
                    <Spinner />
                  ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                  ) : movieList.length === 0 ? (
                    <p>No movies found.</p>
                  ) : (
                    <ul>
                      {movieList.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </main>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
