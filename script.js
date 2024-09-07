document.addEventListener("DOMContentLoaded", function () {
  const profileUrl = "http://13.201.28.236:8000/profile-user/";
  const updateProfileUrl = "http://13.201.28.236:8000/update-profile-user/";
  const changePasswordUrl = "http://13.201.28.236:8000/change-password/";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1NzYzNTMyLCJpYXQiOjE3MjU3MTMxMzIsImp0aSI6ImY3OWVhZjE4Y2U0NTRhMTRhYWUxM2NhODc4MjdlMzg1IiwidXNlcl9pZCI6OTl9.l2TL69RsQv6urMgv8SqcLkOQ643CZZZPjhM0_47xmhA";

  // Fetch profile information on page load
  fetch(profileUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Profile Information:", data);
      document.getElementById("inputUsername").value = data.username || "";
      document.getElementById("inputEmailAddress").value = data.email || "";
      document.getElementById("inputFirstName").value = data.name.split(" ")[0] || "";
      document.getElementById("inputLastName").value = data.name.split(" ")[1] || "";
      document.getElementById("inputPhone").value = data.phone_number || "";
      document.getElementById("inputLocation").value = data.address || "";
    })
    .catch((error) => {
      console.error("Failed to fetch profile information:", error);
    });

  // Elements
  const dashboardButton = document.getElementById("dashboardButton");
  const changePasswordButton = document.getElementById("changePasswordButton");
  const accountDetailsSection = document.getElementById("accountDetails");
  const changePasswordForm = document.getElementById("changePasswordForm");
  const saveEditButton = document.querySelector(".save-edit-btn");
  const submitPasswordButton = document.getElementById("submitPassword");
  const cancelPasswordButton = document.getElementById("cancelPassword");
  const formElements = document.querySelectorAll("#accountDetails input");
  const passwordFormElements = document.querySelectorAll("#changePasswordForm input");

  let isEditMode = false; // To track whether we are in edit mode

  // Function to toggle the readonly attribute on form fields
  const toggleFormEditable = (editable) => {
    formElements.forEach((input) => {
      input.readOnly = !editable;
    });
  };

  // Show account details form
  const showAccountDetails = () => {
    accountDetailsSection.style.display = "block";
    changePasswordForm.style.display = "none";
    toggleFormEditable(false);
    saveEditButton.textContent = "Edit"; // Set button to "Edit"
    isEditMode = false; // Exit edit mode
  };

  // Show change password form
  const showChangePasswordForm = () => {
    accountDetailsSection.style.display = "none";
    changePasswordForm.style.display = "block";
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedProfile)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile Updated:", data);
        alert("Profile updated successfully!");
        toggleFormEditable(false);
        saveEditButton.textContent = "Edit"; // Change button to "Edit"
        isEditMode = false; // Exit edit mode
      })
      .catch((error) => {
        console.error("Failed to update profile information:", error);
        alert("Failed to update profile. Please try again.");
      });
  };

  // Change password function
  const changePassword = () => {
    const currentPassword = document.getElementById("inputOldPassword").value;
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
        current_password: currentPassword,  // API expects "current_password"
        new_password: newPassword           // API expects "new_password"
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errData => {
          console.error('Failed to change password:', errData);
          alert(errData.error || 'Failed to change password.');
          throw new Error(`HTTP error! status: ${response.status}`);
        });
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
  
  // Cancel password change and clear the input fields
  const cancelPasswordChange = () => {
    document.getElementById("inputOldPassword").value = "";
    document.getElementById("inputNewPassword").value = "";
    document.getElementById("inputConfirmPassword").value = "";
  };

  // Toggle button functionality for Save/Edit
  saveEditButton.addEventListener("click", () => {
    if (isEditMode) {
      // If in edit mode, save the profile data
      saveProfileData();
    } else {
      // If not in edit mode, enable editing
      toggleFormEditable(true);
      saveEditButton.textContent = "Save"; // Change button to "Save"
      isEditMode = true; // Enter edit mode
    }
  });

  // Event listeners for buttons
  dashboardButton.addEventListener("click", showAccountDetails);
  changePasswordButton.addEventListener("click", showChangePasswordForm);
  submitPasswordButton.addEventListener("click", changePassword);
  cancelPasswordButton.addEventListener("click", cancelPasswordChange);

  // Show account details form by default
  showAccountDetails();
});
