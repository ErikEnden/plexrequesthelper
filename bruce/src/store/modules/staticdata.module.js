import axios from "axios";
export const staticdata = {
  namespaced: true,
  state: {
    movieGenres: null,
    tvGenres: null,
  },
  mutations: {
    setMovieGenres(state, data) {
      state.movieGenres = data;
    },
    setTVGenres(state, data) {
      state.tvGenres = data;
    },
  },
  actions: {
    getMovieGenres({ commit }) {
      axios({
        url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.VUE_APP_TMDB_KEY}`,
        method: "GET",
      }).then((res) => {
        commit("setMovieGenres", res.data);
      });
    },
    getTVGenres({ commit }) {
      axios({
        url: `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.VUE_APP_TMDB_KEY}`,
        method: "GET",
      }).then((res) => {
        commit("setTVGenres", res.data);
      });
    },
  },
  getters: {
    movieGenres: (state) => {
      return state.movieGenres ?? null;
    },
    tvGenres: (state) => {
      return state.tvGenres ?? null;
    },
  },
};
