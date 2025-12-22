// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent form from reloading the page

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Use relative path for same origin or environment variable for different origins
  const apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/auth/login' 
    : '/api/auth/login'; // For Vercel deployment

  const res = await fetch(apiUrl, {
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