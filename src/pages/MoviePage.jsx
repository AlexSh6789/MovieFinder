import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';

import SelectedMovieCard from 'components/SelectedMovieCard';

import RelMoviesCard from 'components/RelMoviesCard';

import withContextPortal from 'hoc/GlobalContext/withContextPortal';

import { initSelectedMovieFetch } from 'store/selectedMovie/actions';

class MoviePage extends Component {
  static propTypes = {
    match: PropTypes.PropTypes.objectOf(PropTypes.any).isRequired,
    context: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  state = {
    lastMovie: this.props.match.params.id,
  }

  componentDidMount = () => {
    const { lastMovie } = this.state;

    initSelectedMovieFetch(this.props.context, lastMovie);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.id !== prevState.lastMovie) {
      return {
        lastMovie: nextProps.match.params.id,
      };
    }
    return null;
  }

  // Update data on movie id(URL) change
  componentDidUpdate = (_, prevState) => {
    const { lastMovie } = this.state;

    if (prevState.lastMovie !== lastMovie) {
      initSelectedMovieFetch(this.props.context, lastMovie);
    }
  }

  render() {
    const { NewMovies, SelectedMovie } = this.props.context;
    const { moviesGenres } = NewMovies;
    const {
      selectedMovie,
      loading,
      loadingRecommended,
      recommendedMovies,
      loadingSimilar,
      similarMovies,
    } = SelectedMovie;

    return (
      <Fragment>

        {
          !loading && !Array.isArray(selectedMovie)
          ? (
            <SelectedMovieCard
              movieObj={selectedMovie}
              movieId={selectedMovie.id}
            />
          )
          : (
            <LinearProgress color="secondary" />
          )
        }

        <RelMoviesCard
          relatedType="recommendedMovies"
          loading={loadingRecommended}
          moviesList={recommendedMovies.slice(0, 6)}
          moviesGenres={moviesGenres}
        />
        <RelMoviesCard
          relatedType="similarMovies"
          loading={loadingSimilar}
          moviesList={similarMovies.slice(0, 6)}
          moviesGenres={moviesGenres}
        />
      </Fragment>
    );
  }
}

export default withContextPortal(MoviePage);