// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent form from reloading the page

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.student) {
    localStorage.setItem('studentId', data.student._id); // save logged-in student ID
    window.location.href = 'studentDashboard.html';
  } else {
    alert(data.message);
  }
});
