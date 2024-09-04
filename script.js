document.addEventListener("DOMContentLoaded", function() {
  const profileUrl = "http://13.201.28.236:8000/profile-user/";
  const updateProfileUrl = "http://13.201.28.236:8000/update-profile-user/";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1NDkwNTIzLCJpYXQiOjE3MjU0NDAxMjMsImp0aSI6Ijc4OWMzYmFhNjFhNDQ0MjlhYWQxNjFiNDE4MWExYWM2IiwidXNlcl9pZCI6OTl9.LBEYBcCbgijFN_flnXNRgAje0F0SnumhWOJsBj2uRe8";

  // Fetch profile information on page load
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

  // Elements
  const saveButton = document.querySelector('.save-btn');
  const editButton = document.querySelector('.edit-btn');
  const formElements = document.querySelectorAll('input');

  // Function to toggle the readonly attribute on form fields
  const toggleFormEditable = (editable) => {
    formElements.forEach((input) => {
      input.readOnly = !editable;
    });
  };

  // Disable form fields initially
  toggleFormEditable(false);

  // Save profile data to the API
  const saveProfileData = () => {
    const updatedProfile = {
      username: document.getElementById("inputUsername").value,
      email: document.getElementById("inputEmailAddress").value,
      name: `${document.getElementById("inputFirstName").value} ${document.getElementById("inputLastName").value}`,
      phone_number: document.getElementById("inputPhone").value,
      address: document.getElementById("inputLocation").value
    };

    fetch(updateProfileUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedProfile)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Profile Updated:", data);
      alert('Profile updated successfully!');
      toggleFormEditable(false);
    })
    .catch(error => {
      console.error("Failed to update profile information:", error);
      alert('Failed to update profile. Please try again.');
    });
  };

  // Event listener for the save button
  saveButton.addEventListener('click', saveProfileData);

  // Event listener for the edit button
  editButton.addEventListener('click', () => {
    toggleFormEditable(true);
  });
});
