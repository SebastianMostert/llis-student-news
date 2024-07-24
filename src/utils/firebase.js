// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE,
    authDomain: "llis-student-news.firebaseapp.com",
    projectId: "llis-student-news",
    storageBucket: "llis-student-news.appspot.com",
    messagingSenderId: "752351858551",
    appId: "1:752351858551:web:aa7b9d7928848b54b45b72",
    measurementId: "G-1284WLDXGJ"
};

console.log(firebaseConfig)
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);