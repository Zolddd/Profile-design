document.addEventListener("DOMContentLoaded", function() {
  const profileUrl = "http://13.201.28.236:8000/profile-user/";
  const updateProfileUrl = "http://13.201.28.236:8000/update-profile-user/";
  const changePasswordUrl = "http://13.201.28.236:8000/change-password/";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1NjE0MDIwLCJpYXQiOjE3MjU1NjM2MjAsImp0aSI6ImJkODExYmM1MDAxYTQwMmViNDYzYWQyMTVhOGU0ZjkzIiwidXNlcl9pZCI6OTl9.jEXc7h4WjgEBUSqW3hPwpBAvBK8YssLMmCEVkPqBs7Q"; 

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
  const dashboardButton = document.getElementById('dashboardButton');
  const changePasswordButton = document.getElementById('changePasswordButton');
  const accountDetailsSection = document.getElementById('accountDetails');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const saveButton = document.querySelector('.save-btn');
  const editButton = document.querySelector('.edit-btn');
  const submitPasswordButton = document.getElementById('submitPassword');
  const cancelPasswordButton = document.getElementById('cancelPassword');
  const formElements = document.querySelectorAll('#accountDetails input');
  const passwordFormElements = document.querySelectorAll('#changePasswordForm input');

  // Function to toggle the readonly attribute on form fields
  const toggleFormEditable = (editable) => {
    formElements.forEach((input) => {
      input.readOnly = !editable;
    });
  };

  // Show account details form
  const showAccountDetails = () => {
    accountDetailsSection.style.display = 'block';
    changePasswordForm.style.display = 'none';
    toggleFormEditable(false);
  };

  // Show change password form
  const showChangePasswordForm = () => {
    accountDetailsSection.style.display = 'none';
    changePasswordForm.style.display = 'block';
  };

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

  // Change password functionality
  const changePassword = () => {
    const oldPassword = document.getElementById("inputOldPassword").value;
    const newPassword = document.getElementById("inputNewPassword").value;
    const confirmPassword = document.getElementById("inputConfirmPassword").value;

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    fetch(changePasswordUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Password Changed:", data);
      alert('Password changed successfully!');
      showAccountDetails();
    })
    .catch(error => {
      console.error("Failed to change password:", error);
      alert('Failed to change password. Please try again.');
    });
  };

  // Event listeners for buttons
  dashboardButton.addEventListener('click', showAccountDetails);
  changePasswordButton.addEventListener('click', showChangePasswordForm);
  saveButton.addEventListener('click', saveProfileData);
  editButton.addEventListener('click', () => toggleFormEditable(true));
  submitPasswordButton.addEventListener('click', changePassword);
  cancelPasswordButton.addEventListener('click', showAccountDetails);

  // Show account details form by default
  showAccountDetails();
});
