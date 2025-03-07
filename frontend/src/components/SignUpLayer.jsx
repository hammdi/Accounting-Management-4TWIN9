import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link } from "react-router-dom";
import {/*useEffect,*/useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpLayer = () => {
  const [name, setName] = useState("");
  const [email, setEmail]= useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: ""
    };

    // Name validation
    if (name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phone)) {
      newErrors.phone = "Le numéro de téléphone doit contenir 8 chiffres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post("http://localhost:5000/api/users/register", {
          name: name,
          email: email,
          password: password,
          phone:phone,

        })
        .then((response) => {
         // console.log(response);
          navigate("/", { state: { message: "Go check your email!" }  });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12'>Sign Up to your Account</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p>
          </div>
          <form onSubmit={handleSubmit}/*action='#'*/>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:person'/>
              </span>
              <input
                  type='text'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  placeholder='Username'
                  onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
            </div>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email'/>
              </span>
              <input
                  type='email'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
            </div>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='ic:baseline-phone'/>
              </span>
              <input
                  type='tel'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  placeholder='Phone Number'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
            </div>
            <div className='mb-20'>
              <div className='position-relative '>
                <div className='icon-field'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline'/>
                  </span>
                  <input
                      type={showPassword ? 'text' : 'password'}
                      className='form-control h-56-px bg-neutral-50 radius-12'
                      id='your-password'
                      placeholder='Password'
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <span
                    className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                    data-toggle='#your-password'
                    onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              <span className='mt-12 text-sm text-secondary-light'>
                Your password must have at least 8 characters
              </span>
            </div>
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-start'>
                  <input
                      className='form-check-input border border-neutral-300 mt-4'
                      type='checkbox'
                      defaultValue=''
                      id='condition'
                  />
                  <label
                      className='form-check-label text-sm'
                      htmlFor='condition'
                  >
                    By creating an account means you agree to the
                    <Link to='#' className='text-primary-600 fw-semibold'>
                      Terms &amp; Conditions
                    </Link>{" "}
                    and our
                    <Link to='#' className='text-primary-600 fw-semibold'>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            <button
                type='submit'
                className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
            >
              {" "}
              Sign Up
            </button>
            <div className='mt-32 center-border-horizontal text-center'>
              <span className='bg-base z-1 px-4'>Or sign up with</span>
            </div>
            <div className='mt-32 d-flex align-items-center gap-3'>
              <button
                  type='button'
                  className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
              >
                <Icon
                    icon='ic:baseline-facebook'
                    className='text-primary-600 text-xl line-height-1'
                />
                Google
              </button>
              <button
                  type='button'
                  className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
              >
                <Icon
                    icon='logos:google-icon'
                    className='text-primary-600 text-xl line-height-1'
                />
                Google
              </button>
            </div>
            <div className='mt-32 text-center text-sm'>
              <p className='mb-0'>
                Already have an account?{" "}
                <Link to='/sign-in' className='text-primary-600 fw-semibold'>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
