import {Icon} from '@iconify/react/dist/iconify.js';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

///////////////////////////////////////////////////////////////////////////////////////
const getUserAvatar = (avatar) => {
    if (avatar) {
        console.log("Avatar:", avatar);

        // Vérifie si l'avatar est déjà une chaîne Base64
        if (typeof avatar === 'string' && avatar.startsWith('data:image/png;base64,')) {
            return avatar; // L'avatar est déjà au format Base64
        }

        // Si l'avatar est un objet Buffer avec un tableau de données
        if (avatar && avatar.data && Array.isArray(avatar.data)) {
            // Convertir les données du tableau en chaîne Base64
            const base64Avatar = arrayBufferToBase64(new Uint8Array(avatar.data));
            console.log("Avatar converti en Base64:", base64Avatar); // Affiche l'avatar converti
            return `data:image/png;base64,${base64Avatar}`;
        }

        console.log("L'avatar n'est pas un format valide.");
    }

    return "default-avatar.png"; // Image par défaut si l'avatar est vide ou invalide
};

// Fonction utilitaire pour convertir un tableau Uint8Array en chaîne Base64
const arrayBufferToBase64 = (uint8Array) => {
    let binary = '';
    const len = uint8Array.length;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary); // Convertir en Base64
};
///////////////////////////////////////////////////////////////////////////////////////





const UsersListLayer = () => {
    const [users, setUsers] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result); // Prévisualisation
                setSelectedUser((prevUser) => ({
                    ...prevUser,
                    avatar: reader.result.split(",")[1], // Enlever le préfixe "data:image/png;base64,"
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDelete = async (userId) => {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        try {
            const response = await axios.delete(`http://localhost:5000/api/users/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in request headers
                },
            });
            if (response.status === 200) {
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            } else {
                console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axios.get("http://localhost:5000/api/users/users", config);
                setUsers(response.data); // Mettre à jour l'état avec les utilisateurs récupérés
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            }
        };

        fetchUsers().then(r => (console.log("")));
    }, []);
    const [selectedUser, setSelectedUser] = useState(null);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setSelectedUser((prevUser) => ({
            ...prevUser,
            [name]: value, // Met à jour dynamiquement n'importe quel champ
        }));
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
    }

    const handleSubmit = async (/*e,*/ userId) => {
        //e.preventDefault(); // Prevent default form submission

        const token = localStorage.getItem("token"); // Retrieve token from local storage

        try {
            await axios.put(
                `http://localhost:5000/api/users/user/${userId}`,
                selectedUser, // Send updated user data
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in request headers
                        "Content-Type": "application/json", // Ensure proper request format
                    },
                }
            );
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };
    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div
                    className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                defaultValue="Select Number">
                            <option value="Select Number" disabled>
                                Select Number
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <form className="navbar-search">
                            <input
                                type="text"
                                className="bg-base h-40-px w-auto"
                                name="search"
                                placeholder="Search"
                            />
                            <Icon icon="ion:search-outline" className="icon"/>
                        </form>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                defaultValue="Select Status">
                            <option value="Select Status" disabled>
                                Select Status
                            </option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <Link
                        to="/add-user"
                        className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        />
                        Add New User
                    </Link>
                </div>
                <div className="card-body p-24">
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                            <tr>
                                <th scope="col">
                                    <div className="d-flex align-items-center gap-10">
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                className="form-check-input radius-4 border input-form-dark"
                                                type="checkbox"
                                                name="checkbox"
                                                id="selectAll"
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th scope="col">Join Date</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Role</th>
                                <th scope="col" className="text-center">
                                    Status
                                </th>
                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>{
                                users.map((user, index) => (
                                    <tr key={user.id || user._id || index}>
                                        <td>
                                            <div className="d-flex align-items-center gap-10">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <input
                                                        className="form-check-input radius-4 border border-neutral-400"
                                                        type="checkbox"
                                                        name="checkbox"
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td>{new Date(user.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                            <img
            src={getUserAvatar(user.avatar)}
            alt="User Avatar"
            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
        />
                                                <div className="flex-grow-1">
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {user.name}
                                            </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        {user.email}
                                    </span>
                                        </td>
                                        <td>{user.phone}</td>
                                        <td>{user.role}</td>
                                        <td className="text-center">
                                        <span className={`px-24 py-4 radius-4 fw-medium text-sm border 
                                        ${user.status === "Active" ? "bg-success-focus text-success-600 border-success-main" : "bg-danger-focus text-danger-600 border-danger-main"}`}>
                                        {user.status === "Active" ? "Active" : "Inactive"}
                                        </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                <button
                                                    type="button"
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon
                                                        icon="majesticons:eye-line"
                                                        className="icon text-xl"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleEditClick(user)}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModal"
                                                >
                                                    <Icon icon="lucide:edit" className="menu-icon"/>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="menu-icon"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }


                            </tbody>
                        </table>
                    </div>
                    {<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>Showing 1 to 10 of 12 entries</span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                to="#"
                            >
                                <Icon icon="ep:d-arrow-left" className=""/>
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white"
                                to="#"
                            >
                                1
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                to="#"
                            >
                                2
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                3
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                4
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                5
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                to="#"
                            >
                                {" "}
                                <Icon icon="ep:d-arrow-right" className=""/>{" "}
                            </Link>
                        </li>
                    </ul>
                </div>}
                </div>
            </div>

            {/* Modal Start */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Edit user info
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                            {/* Upload Image Start */}
                            <div className="mb-24 mt-16">
                                <div className="avatar-upload">
                                    <div
                                        className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept=".png, .jpg, .jpeg"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle">
                                            <Icon icon="solar:camera-outline" className="icon"></Icon>
                                        </label>
                                    </div>
                                    <div className="avatar-preview">
                                        <div
                                            id="imagePreview"
                                            style={{
                                                backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : '',

                                            }}
                                        >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Upload Image End */}
                            <form onSubmit={() => handleSubmit(selectedUser ? selectedUser._id : "") /*(e) => handleSubmit(e, selectedUser ? selectedUser._id : "")*/}
                                  className="row gy-3 needs-validation">
                                <div className="col-md-6">
                                    <label
                                        htmlFor="name"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        Full Name <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="icon-field has-validation">
                                <span className="icon">
                                    <Icon icon="f7:person"/>
                                </span>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            id="name"
                                            placeholder="Enter Full Name"
                                            value={selectedUser ? selectedUser.name : ""}
                                            onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="email"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        Email <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="icon-field has-validation">
                                <span className="icon">
                                    <Icon icon="mage:email"/>
                                </span>
                                        <input
                                            type="email"
                                            className="form-control radius-8"
                                            id="email"
                                            placeholder="Enter email address"
                                            value={selectedUser ? selectedUser.email : ""}
                                            onChange={(e) => setSelectedUser({
                                                ...selectedUser,
                                                email: e.target.value
                                            })}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="number"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        Phone <span className="text-danger-600">*</span>{" "}

                                    </label>
                                    <div className="icon-field has-validation">
                                <span className="icon">
                                    <Icon icon="solar:phone-calling-linear"/>
                                </span>
                                        <input
                                            type="number"
                                            className="form-control radius-8"
                                            id="number"
                                            placeholder="Enter phone number"
                                            value={selectedUser ? selectedUser.phone : ""}
                                            onChange={(e) => setSelectedUser({
                                                ...selectedUser,
                                                phone: e.target.value
                                            })}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label
                                        htmlFor="depart"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        Role
                                        <span className="text-danger-600">*</span>{" "}
                                    </label>
                                    <select
                                        className="form-control radius-8 form-select"
                                        id="role"
                                        name="role" // Ajout du name pour la gestion dynamique
                                        value={selectedUser?.role || "user"}
                                        onChange={handleChange}>
                                        <option value='Accountant'>Accountant</option>
                                        <option value='Business Owner'>Business Owner</option>
                                        <option value='user'>user</option>
                                    </select>
                                </div>
                                <div className="col-12 mb-20">
                                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Status{" "}
                                    </label>
                                    <div className="d-flex align-items-center flex-wrap gap-28">
                                        {/* Active Status */}
                                        <div className="form-check checked-success d-flex align-items-center gap-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="status"
                                                id="Activate"
                                                checked={selectedUser?.status === "Active"}
                                                onChange={() => setSelectedUser({...selectedUser, status: "Active"})}
                                            />
                                            <label
                                                className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                htmlFor="Activate"
                                            >
                                                <span className="w-8-px h-8-px bg-success-600 rounded-circle"/>
                                                Active
                                            </label>
                                        </div>

                                        {/* Inactive Status */}
                                        <div className="form-check checked-danger d-flex align-items-center gap-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="status"
                                                id="Inactive"
                                                checked={selectedUser?.status === "Inactive"}
                                                onChange={() => setSelectedUser({ ...selectedUser, status: "Inactive" })}
                                            />
                                            <label
                                                className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                htmlFor="Inactive"
                                            >
                                                <span className="w-8-px h-8-px bg-danger-600 rounded-circle"/>
                                                Inactive
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-center gap-3">
                                    <button
                                        type="button"
                                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
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
                    </div>
                </div>
            </div>
            {/* Modal End */}
        </>

    );
};

export default UsersListLayer;
