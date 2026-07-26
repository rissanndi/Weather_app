import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { fetchWeatherByCity, fetchWeatherByCoords } from "@/services/weatherServices";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function HomeScreen() {
  // State Management
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<any>(null);
  const [coords, setCoords] = useState<any>(null);
  const getWeatherIcon = (mainWeather: string) => {
    switch (mainWeather.toLowerCase()) {
      case "clear":
        return "sunny-outline";
      case "clouds":
        return "cloud-outline";
      case "rain":
        return "rainy-outline";
      case "thunderstorm":
        return "thunderstorm-outline";
      default:
        return "partly-sunny-outline";
    }
  };

  const handleSearch = async () => {
    if (!city) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err: any){
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocationWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Izin ditolak",
          "Aplikasi membutuhkan izin lokasi."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude, accuracy } = location.coords;

      setCoords({
        latitude,
        longitude,
        accuracy,
      });

      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        setAddress(result[0]);
      }

      const data = await fetchWeatherByCoords(
        latitude,
        longitude
      );

      setWeather(data);
    } catch (err) {
      setError("Gagal mendapatkan lokasi.");
    } finally {
      setLoading(false);
    }
  };
      
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Weather</Text>
      <Text style={styles.subtitle}>Selamat datang di aplikasi cuaca!</Text>

      <TextInput
        style={styles.input}
        placeholder="Cari nama kota..."
        placeholderTextColor="#888"
        value={city}
        onChangeText={setCity}>
      </TextInput>

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Cari</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleGetLocationWeather}>
          <Text style={styles.buttonText}>Gunakan Lokasi Saya</Text>
      </TouchableOpacity>

      {loading && (
          <ActivityIndicator
              size="large"
              color="#007AFF"
              style={{ marginTop: 20 }}
          />
      )}

      {error && (
          <Text style={styles.errorText}>{error}</Text>
      )}


      {weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Ionicons
            name={getWeatherIcon(weather.weather[0].main)}
            size={50}
            color="#0084FF"
            style={{ marginBottom: 10 }}
          />
          <Text style ={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>

          <View style={styles.detailContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kelembapan:</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kecepatan angin:</Text>
              <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
            </View>
          </View>
        </View>
      )}

      {address && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Lokasi</Text>

          <Text>
            {[
              address.street,
              address.streetNumber,
            ]
              .filter(Boolean)
              .join(" ")}
          </Text>

          <Text>
            {[
              address.district,
              address.subregion,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>

          <Text>
            {[
              address.city,
              address.region,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>

          <Text>{address.country}</Text>
        </View>
      )}
      {coords && (
        <View style={styles.addressContainer}>
          <Text>Latitude : {coords.latitude.toFixed(6)}</Text>

          <Text>Longitude : {coords.longitude.toFixed(6)}</Text>

          <Text>
            Akurasi GPS : ±
            {Math.round(coords.accuracy ?? 0)} m
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0084ff",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#0084ff",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: "#000",
  },
  button: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 15,
  },
  weatherCard: {
    marginTop: 25,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 450,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: "#666",
    textTransform: "capitalize",
  },
  detailContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
  marginTop: 20,
  borderTopWidth: 1,
  borderTopColor: "#ddd",
  paddingTop: 15,
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  addressContainer: {
  width: "100%",
  marginTop: 15,
  marginBottom: 15,
  padding: 12,
  backgroundColor: "#f8f8f8",
  borderRadius: 8,
  alignItems: "center",
},

addressTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 8,
},
});
