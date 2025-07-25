// Firebase Config
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

// Create references to Firebase Authentication and Realtime Database
const auth = firebase.auth();
const db = firebase.database();




function daysUntilBirthday(birthdateInput) {
  const dob = new Date(birthdateInput);
  // if (isNaN(dob.getTime())) {
  //   console.error("Invalid birthdate:", birthdateInput);
  //   return null;
  // }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dobThisYear = new Date(dob);
  dobThisYear.setFullYear(today.getFullYear());
  dobThisYear.setHours(0, 0, 0, 0);

  

  if (dobThisYear < today) {
    dobThisYear.setFullYear(today.getFullYear() + 1);
      console.log("Is birthday passed?", dobThisYear < today);

  }

  const diffTime = dobThisYear - today;
    console.log("diffTime",diffTime)
console.log(" Math.ceil(diffTime / (1000 * 60 * 60 * 24))", Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      return db.ref("users/" + uid).once("value");
    })
    .then(snapshot => {
      const userData = snapshot.val();
      const name = userData.name || "User";
      const birthdate = userData.birthdate;

      const diffDays = daysUntilBirthday(birthdate);
      if (diffDays === null) {
        document.getElementById("output").innerHTML = `<p>Invalid birthdate format.</p>`;
        return;
      }

      if (diffDays === 0) {
fetch("https://cors-anywhere.herokuapp.com/https://favqs.com/api/qotd")
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then(data => {
    const quoteText = data.quote.body;
    const quoteAuthor = data.quote.author;

            document.getElementById("output").innerHTML = `
              <h2> Happy Birthday, ${name}!</h2>
              <p>Wishing You All the Best From</p>
              <p> From Rawan Abdellatif (WIT - Web Developer)</p>
               <p>"${quoteText}"</p>
               <p> ${quoteAuthor }</p>
             </p>
            `;
          })
         .catch((err) => console.error("Failed to fetch quote", err));

      } else {
        // Not birthday, show days left
        document.getElementById("output").innerHTML = `
          <h3>Hi ${name}!</h3>
<p>Rawan Abdellatif says: There are ${diffDays} day(s) left until your birthday!</p>         `;
      }
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
});

function logout() {
  firebase.auth().signOut().then(() => {
    alert("Logged out successfully.");
    window.location.href = "index.html";
  });
}