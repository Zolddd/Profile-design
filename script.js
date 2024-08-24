document.addEventListener("DOMContentLoaded", function() {
  const profileUrl = "http://13.201.28.236:8000/profile-user/";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0NTI1NDc1LCJpYXQiOjE3MjQ0NzUwNzUsImp0aSI6IjBlMmQ2ODE2NTMxNzQzMWI4YTRjYmY4MWNhZDU1MTY2IiwidXNlcl9pZCI6MTE5fQ.E0806ipzMFkbZ25XBaaa5pYFwg6641qNKsnNNbUYbt0";

  fetch(profileUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Profile Information:", data);
    document.getElementById("inputUsername").value = data.username || '';
    document.getElementById("inputEmailAddress").value = data.email || '';
    document.getElementById("inputFirstName").value = data.name.split(' ')[0] || '';
    document.getElementById("inputLastName").value = data.name.split(' ')[1] || '';
    document.getElementById("inputPhone").value = data.phone_number || '';
    document.getElementById("inputLocation").value = data.address || '';
  })
  .catch(error => {
    console.error("Failed to fetch profile information:", error);
  });
});
