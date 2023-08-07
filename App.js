import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null); // so that previous error does not show up.

    try {
      const response = await fetch("https://swapi.dev/api/films");

      if (!response.ok) {
        throw Error("Something went wrong :/");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false); // Setting isLoading to false no matter we found error or not.
  }, []);

  // Using useEffect in order to make a request immediately when App.js component
  // runs for the very first time without clicking the button.
  // Although we can also press the button to send request.
  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  let content = <h2>No movies to show.</h2>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (isLoading) {
    content = <h2>Loading...</h2>;
  }

  if (error) {
    content = <h2>{error}</h2>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
