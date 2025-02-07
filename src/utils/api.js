// utils/api.js
export const globalRequestQueue = {
    currentRequest: null,
    requests: {},
    addRequest: function(sessionId, request) {
      this.requests[sessionId] = request;
    },
    getRequest: function(sessionId) {
      return this.requests[sessionId];
    }
  };
  