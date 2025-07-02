// Firebase config (same as before)
const firebaseConfig = {
    apiKey: "AIzaSyBQmvpgvOZBw5JVWtNipPjhiR3ktgE_KQg",
    authDomain: "intermediate-jscript-firebase.firebaseapp.com",
    databaseURL: "https://intermediate-jscript-firebase-default-rtdb.firebaseio.com",
    projectId: "intermediate-jscript-firebase",
    storageBucket: "intermediate-jscript-firebase.appspot.com",
    messagingSenderId: "426179941894",
    appId: "1:426179941894:web:55eb00e0d9751f379ed587"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.database();
  


function daysUntilBirthday(birthdateInput) {
  const dob = new Date(birthdateInput);
  if (isNaN(dob.getTime())) {
    console.error("Invalid birthdate:", birthdateInput);
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dobThisYear = new Date(dob);
  dobThisYear.setFullYear(today.getFullYear());
  dobThisYear.setHours(0, 0, 0, 0);
  console.log("Today:", today.toISOString());
  console.log("Birthday this year:", dobThisYear.toISOString());
  
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
        // Birthday is today, fetch random quote from type.fit
        fetch("https://type.fit/api/quotes")
          .then(res => res.json())
          .then(quotes => {
            // Pick a random quote
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[randomIndex];

            document.getElementById("output").innerHTML = `
              <h2>🎉 Happy Birthday, ${name}!</h2>
              <p>"${quote.text}"<br>— ${quote.author || "Unknown"}</p>
            `;
          })
          .catch(() => {
            document.getElementById("output").innerHTML = `
              <h2>🎉 Happy Birthday, ${name}!</h2>
              <p>Have a wonderful day!</p>
            `;
          });
      } else {
        // Not birthday, show days left
        document.getElementById("output").innerHTML = `
          <h3>Hi ${name}!</h3>
          <p>🎈 ${diffDays} day${diffDays > 1 ? "s" : ""} left until your birthday!</p>
        `;
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