import { Icon } from "@iconify/react/dist/iconify.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect,useState} from "react";
import {toast} from "react-toastify";

const SignInLayer = () => {
  const [email, setEmail]= useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        email,
        password,
      });
      // Check if the response contains a token (successful login)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save token
        navigate("/home");
      } else {
       // console.log(response.data.message)
       // toast.error("Échec de la connexion: " + response.data.message, { position: "top-right" });
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      if (error.response) {
        const {  message } = error.response.data;
        if (error.status === 404&& message === "Utilisateur non trouvé") {
          toast.error("Utilisateur non trouvé ❌", { position: "top-right" });
        } else if (error.status === 400 && message === "activation required") {
          toast.warning("Votre compte n'est pas activé. Veuillez vérifier votre e-mail. ⚠️", { position: "top-right" });
        } else if (error.status === 400 && message === "Mot de passe incorrect") {
          toast.error("Mot de passe incorrect. Veuillez réessayer. 🔑", { position: "top-right" });
        } else {
          toast.error("Erreur inconnue: " + message, { position: "top-right" });
        }
      } else {
        toast.error("Erreur de connexion au serveur. Vérifiez votre connexion internet.", { position: "top-right" });
      }

    }
  };
    const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accountActivated = queryParams.get("accountActivated");

  useEffect(() => {
    if (accountActivated) {
      toast.success("Your account has been activated! You can now log in.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if(location.state?.message==="Go check your email and get the new password")
      toast.info("Please check your email and get the new password.", {
        position: "top-right",
        autoClose: 3000,
      });
    if (location.state?.message) {
      toast.info(<div>
    <span className="d-flex align-items-center gap-2">
      <Icon icon="logos:google-gmail" className="text-xl" />
      <a
          href="https://mail.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 fw-semibold"
      >
        Check your Gmail
      </a>
    </span>
      </div>, {
        position: "top-right", // ✅ Show in top-right
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location,accountActivated]);

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
            <h4 className='mb-12'>Sign In to your Account</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p>
          </div>
          <form onSubmit = {handleSubmit}/*action='#'*/>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
                type='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
                value={email} // ✅ Link state
                onChange={(e) => setEmail(e.target.value)} // ✅ Update state
              />
            </div>
            <div className='position-relative mb-20'>
              <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline' />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  id='your-password'
                  placeholder='Password'
                  value={password} // ✅ Link state
                  onChange={(e) => setPassword(e.target.value)} // ✅ Update state
                />
              </div>
              <span
                className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                data-toggle='#your-password'
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-center'>
                  <input
                    className='form-check-input border border-neutral-300'
                    type='checkbox'
                    defaultValue=''
                    id='remeber'
                  />
                  <label className='form-check-label' htmlFor='remeber'>
                    Remember me{" "}
                  </label>
                </div>
                <Link to='/forgot-password' className='text-primary-600 fw-medium'>
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
            >
              {" "}
              Sign In
            </button>
            <div className='mt-32 center-border-horizontal text-center'>
              <span className='bg-base z-1 px-4'>Or sign in with</span>
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
                Facebook
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
                Don’t have an account?{" "}
                <Link to='/sign-up' className='text-primary-600 fw-semibold'>
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
