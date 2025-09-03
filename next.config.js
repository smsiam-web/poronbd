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
    STEADFAST_API_KEY: "jlrucxcrscnbuk3cnp9hm1uq4lhwuoyz ",
    STEADFAST_BASE_URL: "https://portal.packzy.com/api/v1",
    STEADFAST_SECRET_KEY: "sgorfaoc9gcx8cshnn337qfa ",
    FIREBASE_API_KEY: "AIzaSyCoUqj3PS5WS15C-bxiCjUi2mNwLjeHdjk",
    FIREBASE_AUTH_DOMAIN: "poron-5e3f7.firebaseapp.com",
    FIREBASE_PROJECT_ID: "poron-5e3f7",
    FIREBASE_STORAGE_BUCKET: "poron-5e3f7.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: "931161984423",
    FIREBASE_APP_ID: "1:931161984423:web:d0af5006edf08592737a82",
    FIREBASE_MEASUREMENT_ID: "G-G73985K5BK",
    PATHAO_CLIENT_ID: "YqaQkRGdnj",
    PATHAO_CLIENT_SECRET: "BlsLo8rmc621S6mabzxVs2Aq1TwaXa39E8s44bxD",
    PATHAO_BASE_URL: "https://api-hermes.pathao.com",
    PATHAO_USERNAME: "smsiam696@gmail.com",
    PATHAO_PASSWORD: "siam.siam",
  },
};

module.exports = nextConfig;
