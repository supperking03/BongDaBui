import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBSS7q-_4ulRBlORCiaU5ccJfKfd4BzSiA",
    authDomain: "testdatabase-41f31.firebaseapp.com",
    databaseURL: "https://testdatabase-41f31.firebaseio.com",
    projectId: "testdatabase-41f31",
    storageBucket: "testdatabase-41f31.appspot.com",
    messagingSenderId: "858636991462"
};
export const firebaseApp = firebase.initializeApp(config);