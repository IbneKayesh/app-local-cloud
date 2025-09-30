let apiBaseUrlPromise = null;
let apiBaseUrl = null;

export const getApiBaseUrl = () => {
  if (apiBaseUrl) return Promise.resolve(apiBaseUrl);
  if (apiBaseUrlPromise) return apiBaseUrlPromise;

  apiBaseUrlPromise = fetch('config.json')
    .then(res => res.json())
    .then(config => {
      apiBaseUrl = config.apiBaseUrl;
      return apiBaseUrl;
    })
    .catch(err => {
      console.error('Failed to load config:', err);
      return "http://localhost:8085/api";
    });

  return apiBaseUrlPromise;
};
