# Konteks Proyek: Aplikasi Cuaca

Ini adalah proyek React Native yang menggunakan Expo untuk membangun aplikasi cuaca sederhana.

## Teknologi Utama

- **Framework**: React Native dengan Expo
- **Routing**: `expo-router` (file-based routing)
- **HTTP Client**: `axios` (untuk mengambil data cuaca dari API)
- **Lokasi**: `expo-location` (untuk mendapatkan lokasi pengguna saat ini)
- **UI**: Komponen standar React Native, dengan komponen kustom bertema (`ThemedText`, `ThemedView`).

## Catatan Penting

- **Versi Expo**: Proyek ini menggunakan Expo SDK ~51.0.0. Harap merujuk pada versi dokumentasi yang benar. `package.json` menentukan `expo: "~51.0.8"`.
- **Dokumentasi**: Baca dokumentasi versi yang tepat di https://docs.expo.dev/versions/v51.0.0/ sebelum menulis kode apa pun.
- **Struktur File**:
  - Layar aplikasi berada di `src/app`.
  - Komponen yang dapat digunakan kembali ada di `src/components`.
  - Konstanta (seperti warna, spasi) ada di `src/constants`.
  - Hooks ada di `src/hooks`.
