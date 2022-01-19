import axios from "axios";

export const request = {
  namespaced: true,
  state: {
    requests: null,
    requestsUpdating: false,
    display: false,
    requestTarget: null,
  },
  mutations: {
    setRequests(state, data) {
      state.requestsUpdating = true;
      state.requests = data;
      state.requestsUpdating = false;
    },
    openCreateRequestModal(state, data) {
      console.log(data);
      state.requestTarget = data;
      state.display = true;
    },
    closeCreateRequestModal(state) {
      state.display = false;
      state.requestTarget = null;
    },
    updateRequest(state, data) {
      state.requestsUpdating = true;
      state.requests.results[
        state.requests.results.findIndex((x) => x.id === data.id)
      ] = data;
      state.requestsUpdating = false;
    },
  },
  actions: {
    retrieveRequests({ commit }) {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_API_URL}requests/list`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }).then((res) => {
        commit("setRequests", res.data);
      });
    },
    openCreateRequestModal({ commit }, data) {
      commit("openCreateRequestModal", data);
    },
    closeCreateRequestModal({ commit }) {
      commit("closeCreateRequestModal");
    },
    createRequest({ state }, data) {
      return axios({
        method: "post",
        url: `${process.env.VUE_APP_API_URL}requests/new`,
        data: {
          target: state.requestTarget.data,
          poster_url: state.requestTarget.poster,
          notes: data.notes,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
    acceptRequest(context, data) {
      return axios({
        method: "patch",
        url: `${process.env.VUE_APP_API_URL}requests/accept/${data}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
    updateRequest({ commit }, data) {
      commit("updateRequest", data);
    },
  },
  getters: {
    requests: (state) => {
      return state.requests;
    },
    showRequestModal: (state) => {
      return state.display;
    },
    requestTarget: (state) => {
      return state.requestTarget;
    },
    requestsUpdating: (state) => {
      return state.requestsUpdating;
    },
  },
};
