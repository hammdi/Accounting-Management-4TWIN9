"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { useEffect, useState } from "react"
import { getCurrentUser } from "../services/authService"
import axios from "axios"
////////////////////////////
const getUserAvatar = (avatar) => {
  if (avatar) {
    // Vérifie si l'avatar est déjà une chaîne Base64
    if (typeof avatar === "string" && avatar.startsWith("data:image/png;base64,")) {
      return avatar // L'avatar est déjà au format Base64
    }
    // Si l'avatar est un objet Buffer avec un tableau de données
    if (avatar && avatar.data && Array.isArray(avatar.data)) {
      // Convertir les données du tableau en chaîne Base64
      const base64Avatar = arrayBufferToBase64(new Uint8Array(avatar.data))
      //console.log("Avatar converti en Base64:", base64Avatar); // Affiche l'avatar converti
      return `data:image/png;base64,${base64Avatar}`
    }

    console.log("L'avatar n'est pas un format valide.")
  }

  return "default-avatar.png" // Image par défaut si l'avatar est vide ou invalide
}

// Fonction utilitaire pour convertir un tableau Uint8Array en chaîne Base64
const arrayBufferToBase64 = (uint8Array) => {
  let binary = ""
  const len = uint8Array.length
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  return window.btoa(binary) // Convertir en Base64
} //////////////////////

const ViewProfileLayer = () => {
  const [imagePreview, setImagePreview] = useState()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }
  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result) // Prévisualisation

        setUser((prevUser) => ({
          ...prevUser,
          avatar: reader.result.split(",")[1], // Garde le préfixe "data:image/png;base64,"
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const [user, setUser] = useState(null)
  const [userData, setuserData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewMode, setIsViewMode] = useState(true)

  // Add this function to toggle between view and edit modes
  const toggleViewMode = () => {
    setIsViewMode(!isViewMode)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser()
      console.log(userData)
      if (userData) {
        setUser(userData)
        setuserData(userData)
        setImagePreview(getUserAvatar(userData ? userData.avatar : ""))
      }
    }
    fetchUser().then((r) => console.log(""))
  }, [])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault() // Prevent default form submission if event is provided

    const token = localStorage.getItem("token")
    if (!token || !user || !user._id) {
      console.error("Missing token or user data")
      return
    }

    try {
      console.log("Sending updated user data:", user)

      await axios.put(`http://localhost:5000/api/users/user/${user._id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !")
      return
    }

    const token = localStorage.getItem("token")
    try {
      await axios.put(
        "http://localhost:5000/api/users/update-password",
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
      alert("Mot de passe mis à jour avec succès !")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error)
      alert("Échec de la mise à jour du mot de passe.")
    }
  }

  const toggle2FA = async () => {
    if (!user) return

    const token = localStorage.getItem("token")
    if (!token) {
      console.error("Missing token")
      return
    }

    try {
      const updatedUser = {
        ...user,
        is_2fa_enabled: !user.is_2fa_enabled,
      }

      await axios.put(`http://localhost:5000/api/users/user/${user._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      setUser(updatedUser)
      alert(`Two-factor authentication ${updatedUser.is_2fa_enabled ? "enabled" : "disabled"} successfully!`)
    } catch (error) {
      console.error("Error updating 2FA status:", error)
      alert("Failed to update 2FA status. Please try again.")
    }
  }

  return (
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
          <img src="assets/images/user-grid/user-grid-bg1.png" alt="" className="w-100 object-fit-cover" />
          <div className="pb-24 ms-16 mb-24 me-16 mt--100">
            <div className="text-center border border-top-0 border-start-0 border-end-0">
              <img
                src={getUserAvatar(userData ? userData.avatar : "") || "/placeholder.svg"}
                alt=""
                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
              />
              <h6 className="mb-0 mt-16">{userData ? userData.name : ""}</h6>
              <span className="text-secondary-light mb-16">{user ? user.email : ""}</span>
            </div>
            <div className="mt-24">
              <div className="d-flex justify-content-between align-items-center mb-16">
                <h6 className="text-xl mb-0">Personal Info</h6>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={toggleViewMode}>
                  {isViewMode ? "Edit" : "View"}
                </button>
              </div>
              <ul>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">Full Name</span>
                  <span className="w-70 text-secondary-light fw-medium">: {user ? user.name : ""}</span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light"> Email</span>
                  <span className="w-70 text-secondary-light fw-medium">: {user ? user.email : ""}</span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light"> Phone Number</span>
                  <span className="w-70 text-secondary-light fw-medium">: {user ? user.phone : ""}</span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light"> Role</span>
                  <span className="w-70 text-secondary-light fw-medium">: {user ? user.role : ""}</span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light"> Status</span>
                  <span
                    className={`w-70 fw-medium ${user && user.status === "Active" ? "text-success" : "text-warning"}`}
                  >
                    : {user ? user.status : ""}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light"> 2FA</span>
                  <span className="w-70 text-secondary-light fw-medium">
                    : {user && user.is_2fa_enabled ? "Enabled" : "Disabled"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-body p-24">
            <ul className="nav border-gradient-tab nav-pills mb-20 d-inline-flex" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24 active"
                  id="pills-edit-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-edit-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-edit-profile"
                  aria-selected="true"
                >
                  Edit Profile
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24"
                  id="pills-change-passwork-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-change-passwork"
                  type="button"
                  role="tab"
                  aria-controls="pills-change-passwork"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  Change Password
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24"
                  id="pills-security-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-security"
                  type="button"
                  role="tab"
                  aria-controls="pills-security"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  Security Settings
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-edit-profile"
                role="tabpanel"
                aria-labelledby="pills-edit-profile-tab"
                tabIndex={0}
              >
                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                {/* Upload Image Start */}
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                      >
                        <Icon icon="solar:camera-outline" className="icon"></Icon>
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: `url(${imagePreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Upload Image End */}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label htmlFor="name" className="form-label fw-semibold text-primary-light text-sm mb-8">
                          Full Name
                          <span className="text-danger-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="name"
                          placeholder="Enter Full Name"
                          value={user ? user.name : ""}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                          Email <span className="text-danger-600">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control radius-8"
                          id="email"
                          placeholder="Enter email address"
                          value={user ? user.email : ""}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label htmlFor="number" className="form-label fw-semibold text-primary-light text-sm mb-8">
                          Phone <span className="text-danger-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="number"
                          placeholder="Enter phone number"
                          value={user ? user.phone : ""}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label htmlFor="role" className="form-label fw-semibold text-primary-light text-sm mb-8">
                          Role
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="role"
                          placeholder="Enter role"
                          value={user ? user.role : ""}
                          onChange={(e) => setUser({ ...user, role: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label htmlFor="status" className="form-label fw-semibold text-primary-light text-sm mb-8">
                          Status
                        </label>
                        <select
                          className="form-control radius-8 form-select"
                          id="status"
                          value={user && user.status ? user.status : "Active"}
                          onChange={(e) => setUser({ ...user, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="tab-pane fade"
                id="pills-change-passwork"
                role="tabpanel"
                aria-labelledby="pills-change-passwork-tab"
                tabIndex={0}
              >
                {/* Champ Nouveau Mot de Passe */}
                <div className="mb-20">
                  <label htmlFor="your-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                    New Password <span className="text-danger-600">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control radius-8"
                      id="your-password"
                      placeholder="Enter New Password*"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className={`toggle-password ${
                        passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
                {/* Champ Confirmation Mot de Passe */}
                <div className="mb-20">
                  <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Confirm Password <span className="text-danger-600">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className="form-control radius-8"
                      id="confirm-password"
                      placeholder="Confirm Password*"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className={`toggle-password ${
                        confirmPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={toggleConfirmPasswordVisibility}
                    ></span>
                  </div>
                </div>
                {/* Bouton de soumission */}
                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary" onClick={handlePasswordUpdate}>
                    Update Password
                  </button>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-security"
                role="tabpanel"
                aria-labelledby="pills-security-tab"
                tabIndex={0}
              >
                <h6 className="text-md text-primary-light mb-16">Security Settings</h6>
                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                  <label htmlFor="twoFactorAuth" className="position-absolute w-100 h-100 start-0 top-0" />
                  <div className="d-flex align-items-center gap-3 justify-content-between">
                    <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                      Two-Factor Authentication (2FA)
                    </span>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="twoFactorAuth"
                      checked={user ? user.is_2fa_enabled : false}
                      onChange={toggle2FA}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-secondary-light">
                    Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need
                    to provide a verification code in addition to your password when logging in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfileLayer
