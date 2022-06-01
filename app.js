// Import the functions you need from the SDKs you need
import { updateDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { collection, onSnapshot, addDoc,
         deleteDoc, doc, query, where,
         orderBy,serverTimestamp, getDoc
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
    getAuth, 
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKJ1vl3R5b3Ou0TNS0MBrieLjjvaY74j8",
  authDomain: "myfirstfirebaseproject-4d803.firebaseapp.com",
  databaseURL: "https://myfirstfirebaseproject-4d803-default-rtdb.firebaseio.com",
  projectId: "myfirstfirebaseproject-4d803",
  storageBucket: "myfirstfirebaseproject-4d803.appspot.com",
  messagingSenderId: "564634534334",
  appId: "1:564634534334:web:b6bcd89a7c08a5d10239ef",
  measurementId: "G-TY84V6CS2B"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();

//collection ref
const colRef = collection(db, 'recipes');

// query
const q = query(colRef, orderBy('createdAt'))

// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let recipes = [];
    snapshot.docs.forEach(doc => {
        recipes.push({...doc.data(), id: doc.id})
    })
    console.log(recipes);
})

// adding documents to database
const addRecipe = document.querySelector('.add');
addRecipe.onsubmit = e => {
    e.preventDefault();

    addDoc(colRef, {
        title: addRecipe.title.value ,
        author: addRecipe.author.value,
        createdAt: serverTimestamp()
    }).then(() => {
        addRecipe.reset()
    }).catch(err => {
        console.log(err.message)
    })


}

const deleteRecipe = document.querySelector('.delete');
deleteRecipe.onsubmit = e => {
    e.preventDefault();

    const docRef = doc(db, 'recipes', deleteRecipe.id.value);
    deleteDoc(docRef)
    .then(() => {
        deleteRecipe.reset()
    }).catch(err=> {
        console.log(err);
    })
}

// get a single document
const docRef = doc(db, 'recipes', 'mlqj4Reb0ER3SjfY6qxh');

const unsubDoc = onSnapshot(docRef, (doc) =>{
    console.log(doc.data(), doc.id);
})

//updating a document
const updateRecipe = document.querySelector('.update');

updateRecipe.onsubmit = e => {
    e.preventDefault();

    const docRef = doc(db, 'recipes', updateRecipe.id.value);
    updateDoc(docRef, {
        title: 'updated title'
    }).then(() => {
        updateRecipe.reset();
    })
}

//signing up users
let signupForm = document.querySelector('.signup');
signupForm.onsubmit = e => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
        // console.log('user created:',  cred.user);
        signupForm.reset();
    }).catch(err => {
        console.log(err.message);
    })
}

//logging in and logging out
const logoutButton = document.querySelector('.logout');
logoutButton.onclick = () => {
    signOut(auth)
    .then(() => {
        // console.log('the user signed out');
    }).catch(err => {
        console.log(err.message);
    })
}

const loginForm = document.querySelector('.login');
loginForm.onsubmit = e => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
        // console.log(cred.user, 'user logged in');
        loginForm.reset();
    }).catch(err => {
        console.log(err.message);
    })
}

//subscribing to Auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user);
})

// unsubscribing from changes
const unsubButton = document.querySelector('.unsub');
unsubButton.onclick = () => {
    console.log('unsubscribing');
    unsubCol();
    unsubDoc();
    unsubAuth();
}