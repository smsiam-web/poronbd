/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },

  env: {
    FIREBASE_API_KEY: "AIzaSyCoUqj3PS5WS15C-bxiCjUi2mNwLjeHdjk",
    FIREBASE_AUTH_DOMAIN: "poron-5e3f7.firebaseapp.com",
    FIREBASE_PROJECT_ID: "poron-5e3f7",
    FIREBASE_STORAGE_BUCKET: "poron-5e3f7.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: "931161984423",
    FIREBASE_APP_ID: "1:931161984423:web:d0af5006edf08592737a82",
    FIREBASE_MEASUREMENT_ID: "G-G73985K5BK",
    PATHAO_CLIENT_ID: "MYerm76dOB",
    PATHAO_CLIENT_SECRET: "ZJHFzctgPkcpHrZOCGVKmNHPKWkAyZnbB3ad99ds",
    PATHAO_BASE_URL: "https://api-hermes.pathao.com",
    PATHAO_USERNAME: "rahulislan19@gmail.com",
    PATHAO_PASSWORD: "Rahul@12345",
  },
};

module.exports = nextConfig;
