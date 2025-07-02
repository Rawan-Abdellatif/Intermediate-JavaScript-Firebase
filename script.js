// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQmvpgvOZBw5JVWtNipPjhiR3ktgE_KQg",
    authDomain: "intermediate-jscript-firebase.firebaseapp.com",
    databaseURL: "https://intermediate-jscript-firebase-default-rtdb.firebaseio.com",
    projectId: "intermediate-jscript-firebase",
    storageBucket: "intermediate-jscript-firebase.appspot.com",
    messagingSenderId: "426179941894",
    appId: "1:426179941894:web:55eb00e0d9751f379ed587"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Handle the sign-up form
  document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Create user with email & password
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        // Save extra info (name and birthdate) in Realtime Database
        return firebase.database().ref("users/" + user.uid).set({
          name: name,
          birthdate: dob
        });
      })
      .then(() => {      window.location.href = "login.html";

        alert("Account created successfully!");
        // Optionally redirect to login.html
        window.location.href = "login.html";
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });
  