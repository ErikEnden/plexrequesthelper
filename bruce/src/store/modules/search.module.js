import axios from "axios";

export const search = {
  namespaced: true,
  state: {
    mediaType: "movie",
    searchQuery: "",
    queryResult: null,
  },
  mutations: {
    toggleMediaType(state) {
      state.mediaType = state.mediaType === "movie" ? "tv" : "movie";
    },
    updateSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setResults(state, data) {
      if (data.page > 1) {
        state.queryResult.results = state.queryResult.results.concat(
          data.results
        );
        state.queryResult.page = data.page;
      } else {
        state.queryResult = data;
        state.queryResult.query = state.searchQuery;
        state.queryResult.mediaType = state.mediaType;
      }
    },
  },
  actions: {
    executeSearch({ state, commit }, page = 1) {
      return new Promise((resolve) => {
        axios({
          method: "GET",
          url: `https://api.themoviedb.org/3/search/${state.mediaType}?query=${
            page > 1 ? state.queryResult.query : state.searchQuery
          }&page=${page}&api_key=${process.env.VUE_APP_TMDB_KEY}`,
        }).then((res) => {
          commit("setResults", res.data);
          resolve();
        });
      });
    },
  },
  getters: {
    mediaType: (state) => state.mediaType,
    queryResult: (state) => state.queryResult,
    searchQuery: (state) => state.searchQuery,
  },
};
