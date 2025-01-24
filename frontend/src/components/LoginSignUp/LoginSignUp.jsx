import React, { useContext, useState } from "react";
import "./LoginSignUp.css";
import defaultAvatar from "../assets/avatar.jpg";
import { HiOutlineMail, LuLock, LuUser2 } from "../index";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "../../redux/api/userApi";
import AuthContext from "../../context/AuthContext";

const LoginSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [action, setAction] = useState("Sign Up");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const {
    isAuthenticated,
    setIsAuthenticated,
    avatar,
    setAvatar,
    showSnackbar,
  } = useContext(AuthContext);

  const [registerUserMutation] = useRegisterUserMutation();
  const [loginUserMutation] = useLoginUserMutation();

  const registerHandler = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      showSnackbar("Min 8 char required in password", "error");
      return;
    }
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.append("avatar", avatar);
    try {
      const { data } = await registerUserMutation(formData);
      if (data) {
        console.log("User registered successfully :", data);
        setIsAuthenticated(true);
        navigate("/");
        showSnackbar("Registered successfully..", "success");
      } else {
        console.log("Error");
        showSnackbar("Error registering user !", "error");
      }
    } catch (error) {
      console.error("Error registering User :", error);
      showSnackbar("Something went wrong! Plz try again..", "error");
    }
  };

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const credentials = { email, password };
      const { data } = await loginUserMutation(credentials);
      if (data && data.user && data.user.role && data.user.avatar.url) {
        console.log("User logged in successfully:", data);
        setIsAuthenticated(true);
        setAvatar(data.user.avatar.url);
        if (data.user.role === "admin") {
          return navigate("/admin/dashboard");
        }
        navigate(redirect);
        showSnackbar(`Logged in as ${data.user.name}`, "success");
      } else {
        console.log("Invalid");
        showSnackbar("Invalid Email or Password !", "error");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      showSnackbar(`Login failed! Plz try again..`, "error");
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "avatar") {
      const selectedAvatar = e.target.files[0];
      setAvatar(selectedAvatar);
      setAvatarPreview(URL.createObjectURL(selectedAvatar));
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="w-full h-[90vh] font-[Nunito] bg-gradient-to-b from-[#eef1f7] to-[#c3cfe2] flex justify-center items-center">
      <form
        encType="multipart/form-data"
        onSubmit={action === "Login" ? loginHandler : registerHandler}
        className="w-[26vw] h-[68vh] bg-[#fff] rounded-lg flex flex-col justify-center items-center shadow-md"
      >
        <div className="h-[10vh] w-full pb-[1vw] text-xl flex justify-center items-center gap-[8vw]">
          <p
            onClick={() => setAction("Sign Up")}
            className={
              action === "Sign Up"
                ? "border-b-[2px] border-b-[#ff6b35]"
                : "cursor-pointer text-[#7a7a7a]"
            }
          >
            Sign Up
          </p>

          {isAuthenticated ? (
            ""
          ) : (
            <p
              onClick={() => setAction("Login")}
              className={
                action === "Login"
                  ? "border-b-[2px] border-b-[#ff6b35]"
                  : "cursor-pointer text-[#7a7a7a]"
              }
            >
              Login
            </p>
          )}
        </div>

        <div className="w-full h-[40vh] flex justify-center items-center">
          <div className="input-fields flex flex-col gap-3 items-center justify-center">
            {action === "Login" ? (
              ""
            ) : (
              <div className="input">
                <LuUser2 className="text-xl text-[#ff6b35]" />
                <input
                  className="fields text-[#000]"
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="input">
              <HiOutlineMail className="text-xl text-[#ff6b35]" />
              <input
                className="fields"
                type="email"
                placeholder="Email Id"
                required
                value={email}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="input">
              <LuLock className="text-xl text-[#ff6b35]" />
              <input
                className="fields"
                type="password"
                placeholder="Password"
                required
                value={password}
                name="password"
                onChange={handleInputChange}
              />
            </div>

            {action === "Login" ? (
              ""
            ) : (
              <div className="image w-[20vw] h-[7vh] flex justify-center items-center gap-[1vw]">
                <div className="w-[35px] h-[35px] bg-cover rounded-full overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={avatarPreview}
                    alt="avatar"
                  />
                </div>
                <input
                  className="w-[10vw] h-[2.3vw] ml-1"
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <input
            className="btn w-[20vw] h-[6vh] bg-[#ff6b35e7] text-white cursor-pointer rounded-lg hover:bg-[#f1582dda]"
            type="submit"
            value={action}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginSignUp;
