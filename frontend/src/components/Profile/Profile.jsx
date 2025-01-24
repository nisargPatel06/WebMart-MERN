import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import defaultAvatar from "../assets/avatar.jpg";
import { TbLoader2 } from "../index";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApi";
import AuthContext from "../../context/AuthContext";

const Profile = () => {
  const { data, refetch } = useGetUserDetailsQuery();
  const { isAuthenticated, avatar, setAvatar, showSnackbar } =
    useContext(AuthContext);
  const [isImgSelected, setIsImgSelected] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const [loading, setLoading] = useState(false);
  const [updateUserMutation] = useUpdateUserMutation();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const { name, email } = userData;

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (data && data.user) {
      setUserData({
        name: data.user.name,
        email: data.user.email,
      });
      setAvatarPreview(data.user.avatar ? data.user.avatar.url : defaultAvatar);
    }
  }, [data]);

  const updateUser = async (e) => {
    e.preventDefault();
    const hasNameChanged = name !== data.user.name;
    const hasEmailChanged = email !== data.user.email;
    const hasAvatarChanged = isImgSelected;

    if (!hasNameChanged && !hasEmailChanged && !hasAvatarChanged) {
      return showSnackbar("No changes detected", "error");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    if (isImgSelected) {
      formData.append("avatar", avatar);
    } else {
      formData.append("avatar", "");
    }
    try {
      setLoading(true);
      const { data } = await updateUserMutation(formData);
      setLoading(false);
      if (data) {
        refetch();
        showSnackbar("Profile Updated..", "success");
      } else {
        showSnackbar("Error updating profile !", "error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile :", error);
      showSnackbar("Something went wrong! Plz try again..", "error");
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "avatar") {
      const selectedAvatar = e.target.files[0];
      setIsImgSelected(true);
      setAvatar(selectedAvatar);
      setAvatarPreview(URL.createObjectURL(selectedAvatar));
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  return (
    <form
      className="p-10 py-[3vw] font-[Nunito] flex justify-center gap-10"
      encType="multipart/form-data"
      onSubmit={updateUser}
    >
      <div className="w-[20%] h-fit p-5 flex flex-col justify-center items-center gap-5 border-[1px">
        <h1 className="text-xl text-center">My Profile</h1>
        <img
          className="w-[10vw] rounded-full"
          src={avatarPreview}
          alt={data.user.name}
        />

        <label className="change">
          CHANGE
          <input
            className="file"
            type="file"
            accept="image/*"
            name="avatar"
            multiple
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="w-[40%] p-5 flex flex-col gap-[3vw] border-[1px">
        <div className="flex items-center">
          <h4 className="text-[#797979] w-[8vw]">NAME :</h4>
          <input
            className="p-1 w-[20vw] border-b-[1px]"
            type="text"
            defaultValue={data.user.name}
            name="name"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center">
          <h4 className="text-[#797979] w-[8vw]">EMAIL :</h4>
          <input
            className="p-1 w-[20vw] border-b-[1px]"
            type="email"
            defaultValue={data.user.email}
            name="email"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center">
          <h4 className="text-[#797979] w-[8vw]">ROLE :</h4>
          <input
            className="p-1 w-[20vw] border-b-[1px]"
            type="text"
            defaultValue={data.user.role}
            name="role"
            readOnly
          />
        </div>

        <div className="flex items-center">
          <h4 className="text-[#797979] w-[8vw]">JOINED AT :</h4>
          <input
            className="p-1 w-[20vw] border-b-[1px]"
            type="text"
            defaultValue={data.user.created_at}
            name="joined"
            readOnly
          />
        </div>

        <button
          type="submit"
          className="p-2 w-[10vw] flex justify-center items-center bg-[#050404] rounded-md text-[#fff] hover:bg-[#f35d26]"
          disabled={loading}
        >
          {loading ? <TbLoader2 className="rotate text-lg" /> : "Save"}
        </button>
      </div>
    </form>
  );
};

export default Profile;
