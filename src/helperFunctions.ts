// https://www.npmjs.com/package/countries-and-timezones
import { getCountryForTimezone } from "countries-and-timezones";
import { MovieModel } from "./MovieModel";
import { fetchMoviesPages, getMovieDetails, getPopularMovies, type MovieDetails, type TMDBMoviePageResult } from "./apiConfig";
import { fetchImdbRatings } from "./bulkImdbApi";
import { runInAction } from "mobx";

export function getVideoUrl(video: { site: string; key: string }) {
  switch (video.site.toLowerCase()) {
    case "youtube":
      return `https://www.youtube.com/embed/${video.key}`;
    case "vimeo":
      return `https://vimeo.com/${video.key}`;
    case "dailymotion":
      return `https://www.dailymotion.com/video/${video.key}`;
    case "facebook":
      return `https://www.facebook.com/watch/?v=${video.key}`;
    case "apple":
      return video.key; // Already a full URL
    default:
      return null;
  }
}

export function minutesToHourAndMinutesText(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const text = hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
  return text;
}

export function getCountryCode(): string | null {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezoneData = getCountryForTimezone(userTimezone);
  console.log(timezoneData);
  return timezoneData ? timezoneData.id : null;
}
export function hideRootAndMainContentOverflow(remove: boolean = false) {
  if (remove) {
    const mainContent = document.querySelector(".mainContent"); // makes the background scrollable again when the DetailsView is removed
    const root = document.querySelector(":root");
    root?.classList.remove("hide-overflow");
    mainContent?.classList.remove("hide-overflow"); // makes the background scrollable again when the DetailsView is removed
  }
  else {
    const mainContent = document.querySelector(".mainContent"); // stops the background from being scrollable when the DetailsView is on top
    const root = document.querySelector(":root");
    root?.classList.add("hide-overflow");
    mainContent?.classList.add("hide-overflow"); // stops the background from being scrollable when the DetailsView is on top
  }
}


export function chunk(array: Array<any>, size: number = 5) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export function getPopularityColor(score: number): string {
    if (score <= 200) {
        const percent = score / 200; 
        const lightness = 100 - (50 * percent); 
        return `hsl(45, 100%, ${lightness}%)`;
    } 
    else {
        const adjScore = Math.min(score, 400); /* To not exceed 400 */
        const percent = (adjScore - 200) / 200; 
        const hue = 45 - (45 * percent);
        return `hsl(${hue}, 100%, 50%)`;
    }
}

export async function configDataForSwipeStart(model: MovieModel) {
  runInAction(() => {
    model.setIsFetchingIdQueue(true);
    model.clearIdQueue();
  })
  const idQueue = await model.setMovieIdQueue()
  model.currentMovieEffect();
  if (Array.isArray(idQueue) && idQueue.length > 0) {
    console.log(idQueue);
    console.log("Setting current movie id to " + idQueue[0]);
    runInAction(() => {
      model.setCurrentMovieId(idQueue[0]);
      model.setIsFetchingIdQueue(false);
    })
  }
}

export async function getFilteredPopularMovies(
  pageOffset: number, 
  pageRange: number, 
  likes: number[], 
  dislikes: number[], 
  selectedGenreIds: number[],
  minRating: number,
  minRuntime: number,
  maxRuntime: number,
): Promise<TMDBMoviePageResult[]> {

  let popularMovies: TMDBMoviePageResult[] = [];
  let fetchCount = Math.floor(Math.random() * pageRange + pageOffset); // random value between 0-30 as a starting point for the popular movies so you always get a variation if you're not using any filter and recommendations.
  const fetchStop = fetchCount + 10;
  while (popularMovies.length < 30 && fetchCount < fetchStop) {
    try {
      const popularData = await fetchMoviesPages(getPopularMovies, 1, fetchCount);

      const filteredData = popularData.filter(movie =>
          movie.genre_ids.some(genre => selectedGenreIds.includes(genre)) // filter by selected genres
          && !likes.includes(movie.id) // not in liked
          && !dislikes.includes(movie.id) // not in disliked
      );
      const fullyFilteredMovies = await filterByRatingAndRuntime(filteredData, minRating, minRuntime, maxRuntime);

      popularMovies = [...popularMovies, ...fullyFilteredMovies];
    } catch (error) {
      console.error('Error fetching movie pages:', error);
    }
      fetchCount++;
  }
  if (fetchCount >= fetchStop) { // if it couldn't find enough filtered movies just append any popular movie to the queue.
      const popularData = await fetchMoviesPages(getPopularMovies, 1, fetchCount+1);
      popularMovies = [...popularMovies, ...popularData];
  }

  return popularMovies;
}

export async function filterByRatingAndRuntime(data: TMDBMoviePageResult[], minRating: number, minRuntime: number, maxRuntime: number): Promise<TMDBMoviePageResult[]> {
  if (!data || data.length === 0) { return [] };
  const details: MovieDetails[] = [];
  for (const movie of data) {
      const detail = await getMovieDetails(movie.id) as MovieDetails;
      if (!detail) {
          continue;
      }
      details.push(detail);
      //await sleep(10); // Do this to avoid API Rate limiting
  }

  const imdbIds = details.map(detail => detail.imdb_id);

  const ratings = (await fetchImdbRatings(imdbIds))?.data?.titles ?? [];
  if (ratings.length === 0) return [];

  const movieIdToRating = new Map<number, number>();
  const movieIdToRuntime = new Map<number, number>();

  for (const detail of details) {
      movieIdToRuntime.set(detail.id, detail.runtime);
      const rating = ratings.find(movie => movie.id === detail.imdb_id);
      if (!rating || !rating?.ratingsSummary?.aggregateRating) continue;
      movieIdToRating.set(detail.id, rating.ratingsSummary.aggregateRating)
  }

  const result = data
      .filter(movie => {
          const rating = movieIdToRating.get(movie.id);
          const runtime = movieIdToRuntime.get(movie.id);
          if (!rating  || rating <= minRating) { return false };
          if (!runtime || runtime <= minRuntime || runtime >= maxRuntime) { return false };
          return true
      })
      .map(movie => {
          return {...movie, imdbRating: movieIdToRating.get(movie.id), runtime: movieIdToRuntime.get(movie.id)}
      });

  return result;
}