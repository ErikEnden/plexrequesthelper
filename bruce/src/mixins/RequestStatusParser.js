const requestStatus = [
  { id: 0, title: "Requested" },
  { id: 1, title: "Accepted" },
  { id: 2, title: "Fulfilled" },
  { id: 3, title: "Rejected" },
  { id: 4, title: "Cancelled" },
];

export default {
  methods: {
    parseRequestStatus(status) {
      return requestStatus.find((x) => x.id === status).title;
    },
  },
};
