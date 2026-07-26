const API_KEY = "5e4af0bceafb423d8a5fef094acd5daf";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Berdasarkan Nama Kota
export async function fetchWeatherByCity(city: string) {
    const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}&lang=id`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal memuat data cuaca");
    return data;
}

// BARU: Berdasarkan Koordinat GPS (Latitude & Longitude)
export async function fetchWeatherByCoords(lat: number, lon: number) {
    const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=id`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal memuat data cuaca");
    return data;
}