export const API_BASE_URL = "http://localhost:8080/ayto";

export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
  'accept': '*/*'
});

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}; 