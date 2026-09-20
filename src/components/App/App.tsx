import { useState } from "react";
import styles from "./App.module.css";
import { type Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import { searchMovies } from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

export interface SearchMovieHandler {
  (query: string): void;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const onSelect: (movie: Movie) => void = (movie) => {
    setSelectedMovie(movie);
  };

  const onClose: () => void = () => {
    setSelectedMovie(null);
  };

  const handleSearch: SearchMovieHandler = async (query) => {
    try {
      setIsLoading(true);
      const response: Movie[] = await searchMovies(query);
      if (response.length === 0) {
        toast.error("No movies found for your search query.");
      }
      setIsError(false);
      setMovies(response);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isError && !isLoading && <ErrorMessage />}
      {isLoading && !isError && <Loader />}
      {!isLoading && !isError && (
        <MovieGrid movies={movies} onSelect={onSelect} />
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
    </div>
  );
}

export default App;
