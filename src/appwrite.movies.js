import { Client, Databases, ID, Query } from "appwrite";

// 🔑 Load from environment
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// ⚡ Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // ✅ use env var, not hardcoded
  .setProject(PROJECT_ID);

const database = new Databases(client);

/**
 * ✅ Save search term + update count if already exists
 */
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 1. Check if searchTerm already exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
      Query.limit(1),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      // 2. Update count
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count ?? 0) + 1,
      });
    } else {
      // 3. Create new document
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        searchedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("❌ updateSearchCount error:", error);
  }
};

/**
 * ✅ Fetch top 5 trending movies from Appwrite DB
 */
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    return result.documents;
  } catch (error) {
    console.error("❌ getTrendingMovies error:", error);
    return [];
  }
};
