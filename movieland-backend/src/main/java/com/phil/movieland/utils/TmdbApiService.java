package com.phil.movieland.utils;

import com.phil.movieland.data.entity.Movie;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.model.Artwork;
import info.movito.themoviedbapi.model.ArtworkType;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.Video;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

/**
 * Service for Tmdb Api interface
 */
@Service
@PropertySource(value = "classpath:/api.properties", ignoreResourceNotFound = true)
public class TmdbApiService {
    public static final String POSTER_BASE_URL = "https://image.tmdb.org/t/p/w185/";
    public static final String IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";


    private final TmdbApi tmdbApi;
    private final TmdbMovies tmdbMovies;

    private Logger log = LoggerFactory.getLogger(TmdbApiService.class);

    /**
     * Additional backdrops stored in memory
     */
    private static HashMap<Long, String> backdrops = new HashMap<>();

    private static HashMap<Long, String> trailers = new HashMap<>();

    /**
     * Create /resources/api.properties with TMDB API-Key
     */
    @Autowired
    public TmdbApiService(@Value("${tmdbApi.apikey}") String apiKey) {
        tmdbApi = new TmdbApi(apiKey);
        tmdbMovies = tmdbApi.getMovies();
    }

    public MovieDb getMovieFromTmdb(Movie movie) {
        if (movie.getTmdbId() == null) {
            log.debug("Search TMDB Api for '{}'", movie.getName());
            MovieResultsPage resultsPage = tmdbApi.getSearch().searchMovie(movie.getName(), null, "en", false, 0);
            List<MovieDb> results = resultsPage.getResults();
            if (!results.isEmpty()) {
                return results.get(0);
            }
        }
        return tmdbMovies.getMovie(movie.getTmdbId().intValue(), "en");
    }

    public List<MovieDb> getMoviesFromTmdb(String name) {
        log.debug("Search TMDB Api for '{}'", name);
        MovieResultsPage resultsPage = tmdbApi.getSearch().searchMovie(name, null, "en", false, 0);
        return resultsPage.getResults();
    }

    public List<MovieDb> getTop10Movies() {
        log.debug("Fetching Top 10 Movies from TMDB Api");
        //return tmdbApi.getMovies().getTopRatedMovies("en",0).getResults().subList(0,10);
        return tmdbApi.getMovies().getNowPlayingMovies("en", 0, "US").getResults().subList(0, 10);
    }

    public String getBackdrop(Long tmdbId) {
        if (backdrops.containsKey(tmdbId)) {
            log.debug("Loading Backdrop for Movie tmdbId='{}' from cache", tmdbId);
            return backdrops.get(tmdbId);
        }
        log.debug("Fetching Backdrop for Movie tmdbId='{}' from TMDB Api", tmdbId);
        List<Artwork> images = tmdbMovies.getMovie(tmdbId.intValue(), "en", TmdbMovies.MovieMethod.images).getImages();
        if (images.isEmpty()) {
            return null;
        }
        Optional<Artwork> backdrop = images.stream().filter(img -> img.getArtworkType() == ArtworkType.BACKDROP).findFirst();
        String path = IMAGE_BASE_URL + backdrop.orElse(images.get(0)).getFilePath();
        log.debug("Loaded Backdrop for '{}' from path: '{}'", tmdbId, path);
        backdrops.put(tmdbId, path);
        return path;
    }

    public String getTrailerURL(Long tmdbId) {
        if (trailers.containsKey(tmdbId)) {
            log.debug("Loading Trailer URL for Movie tmdbId='{}' from cache", tmdbId);
            return trailers.get(tmdbId);
        }
        log.debug("Fetching Trailer URL for Movie tmdbId='{}' from TMDB Api", tmdbId);
        List<Video> videos = tmdbMovies.getMovie(tmdbId.intValue(), "en", TmdbMovies.MovieMethod.videos).getVideos();
        if (!videos.isEmpty()) {
            Video trailer = videos.get(0);
            if (trailer.getSite().equals("YouTube")) {
                //String url="https://youtube.com/watch?v="+trailer.getKey();
                trailers.put(tmdbId, trailer.getKey());
                return trailer.getKey();
            }
        }
        return null;
    }
}
