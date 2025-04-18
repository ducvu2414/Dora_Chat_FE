import React from "react";
import me from "@/api/me";
import { useState, useEffect } from "react";
import { TabUserInfo } from "@/components/ui/UserInformation/tab-user-info";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Icons } from "@/components/ui/icons";
import { AlertMessage } from "@/components/ui/alert-message";
import BannerImage from "@/assets/banner-user-info.png";
import { Spinner } from "@/page/Spinner";
import { Pencil } from "lucide-react";

const availableHobbies = [
  {
    value: "Singing",
    label: "Singing",
    icon: Icons.mic,
  },
  {
    value: "Dancing",
    label: "Dancing",
    icon: Icons.partyPopper,
  },
  {
    value: "Reading",
    label: "Reading",
    icon: Icons.book,
  },
  {
    value: "Writing",
    label: "Writing",
    icon: Icons.notebookPen,
  },
  {
    value: "Painting",
    label: "Painting",
    icon: Icons.palette,
  },
  {
    value: "Photography",
    label: "Photography",
    icon: Icons.camera,
  },
  {
    value: "Cooking",
    label: "Cooking",
    icon: Icons.chefHat,
  },
  {
    value: "Gardening",
    label: "Gardening",
    icon: Icons.fence,
  },
  {
    value: "Traveling",
    label: "Traveling",
    icon: Icons.plane,
  },
  {
    value: "Sports",
    label: "Sports",
    icon: Icons.bike,
  },
];

export default function UserInformation() {
  const [activeTab, setActiveTab] = useState("information");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState();
  const [userInfo, setUserInfo] = useState(null);

  const fileInputRef = React.useRef(null);
  const bannerFileInputRef = React.useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // const reader = new FileReader();
      // reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("id", userInfo._id);
      try {
        setLoading(true);
        const response = await me.uploadAvatar(formData);

        // set local storage
        const userData = JSON.parse(localStorage.getItem("user"));
        userData.avatar = response.avatar;
        localStorage.setItem("user", JSON.stringify(userData));

        // set userInfo useState
        setUserInfo({
          ...userInfo,
          avatar: response.avatar,
        });
      } catch (error) {
        console.error("Error uploading avatar:", error);
      } finally {
        setLoading(false);
      }

      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("cover", file);
      formData.append("id", userInfo._id);
      const response = await me.uploadCover(formData);

      // set local storage
      const userData = JSON.parse(localStorage.getItem("user"));
      userData.coverImage = response.cover;
      localStorage.setItem("user", JSON.stringify(userData));

      // set userInfo useState
      setUserInfo({
        ...userInfo,
        coverImage: response.cover,
      });
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDateOfBirth(newDate); // Cập nhật state
    const [year, month, day] = newDate.split("-").map(Number);
    setUserInfo({
      ...userInfo,
      dateOfBirth: { day, month, year }, // Cập nhật userInfo
    });
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await me.getProfile(user._id);
        setUserInfo(response);
        const qrResponse = await me.getQR(user._id);
        setQr(qrResponse);
        setUserInfo(response);
        console.log("User info:", response);
        setDateOfBirth(
          `${response.dateOfBirth.year}-${String(response.dateOfBirth.month).padStart(2, '0')}-${String(response.dateOfBirth.day).padStart(2, '0')}`
        );
      } catch (err) {
        console.error("Error fetching user profile:", err);
        AlertMessage({
          type: "error",
          message: "Couldn't get profile data.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const handleDownload = () => {
    if (qr) {
      const link = document.createElement("a");
      link.href = qr;
      link.download = "my-qr-code-dora.png"; // Tên file khi tải xuống
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      AlertMessage({
        type: "error",
        message: "Please enter your current password",
      });
      return;
    }

    if (!newPassword) {
      AlertMessage({
        type: "error",
        message: "Please enter your new password",
      });
      return;
    }

    if (!confirmPassword) {
      AlertMessage({
        type: "error",
        message: "Please enter your confirm password",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      AlertMessage({
        type: "error",
        message: "Confirm password does not match",
      });
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      AlertMessage({
        type: "error",
        message:
          "Password must be at least 8 characters long, containing uppercase and lowercase letters and numbers",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await me.updatePassword({
        id: userInfo._id,
        oldPassword: currentPassword,
        newPassword,
      });
      console.log(response);
    } catch (error) {
      console.error("Update password failed:", error);
    } finally {
      setLoading(false);
    }
    AlertMessage({ type: "success", message: "Password changed successfully" });
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!userInfo.name) {
      console.log("check name empty");
      AlertMessage({ type: "error", message: "Please enter your name" });
      return;
    }

    const regexName = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!regexName.test(userInfo.name)) {
      AlertMessage({ type: "error", message: "Name must be characters" });
      return;
    }

    // under 18
    if (new Date().getFullYear() - userInfo.dateOfBirth.year < 18) {
      AlertMessage({ type: "error", message: "Age must be over 18" });
      return;
    }

    try {
      setLoading(true);
      setIsEditing(false);
      const userInfoRequest = {
        id: userInfo._id,
        ...userInfo,
        dateOfBirth: `${userInfo.dateOfBirth.year}-${String(userInfo.dateOfBirth.month).padStart(2, '0')}-${String(userInfo.dateOfBirth.day).padStart(2, '0')}T00:00:00.000Z`,
      };
      delete userInfoRequest._id;
      console.log(userInfoRequest);
      const userUpdated = await me.putProfile(userInfoRequest);
      console.log("User updates:", userUpdated);
      AlertMessage({ type: "success", message: "Updated successful!" });
    } catch (error) {
      console.error("Update profile failed:", error);
      AlertMessage({
        type: "error",
        message: "Update profile failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Main Content */}
      <div className="relative flex-1 p-3 bg-blue-100">
        {loading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Banner Image */}
            {userInfo.coverImage ? (
              <div
                className="w-full bg-center bg-cover h-72 rounded-3xl"
                style={{
                  backgroundImage: `url(${userInfo.coverImage})`,
                }}
              />
            ) : (
              <>
                <div
                  className="w-full bg-center bg-cover h-72 rounded-3xl"
                  style={{
                    backgroundImage: `url(${BannerImage})`,
                  }}
                />
              </>
            )}

            {/* Hidden file input for banner */}
            <input
              type="file"
              ref={bannerFileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleBannerUpload}
            />

            {/* Edit button for banner */}
            {isEditing && (
              <button
                onClick={() => bannerFileInputRef.current.click()}
                className="absolute top-5 right-5 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-md"
                title="Change banner image"
              >
                <Pencil size={18} />
              </button>
            )}

            {/* Profile Content */}
            <div className="flex flex-row max-w-4xl px-8 mx-auto -mt-24 gap-x-5">
              {/* Profile Header */}
              <div className="p-6 mb-6 text-center bg-white shadow-sm rounded-3xl">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {userInfo.avatar ? (
                      loading ? (
                        <div className="flex justify-center my-8">
                          <Spinner />
                        </div>
                      ) : (
                        <img
                          src={userInfo.avatar}
                          alt="User Admin"
                          className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full"
                        />
                      )
                    ) : (
                      // pass color change to background

                      <div
                        alt="User Admin"
                        className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full"
                        style={{ backgroundColor: userInfo.avatarColor }}
                      />
                    )}

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />

                    {isEditing ? (
                      // Edit button
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-4 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>

                  <h1 className="mb-2 text-2xl font-semibold text-gray-900">
                    {userInfo.name}
                  </h1>
                  <p className="mb-6 text-gray-600">⭐ Have a nice day! 🌊</p>

                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    {qr ? (
                      <img src={qr} alt="QR Code" className="w-32 h-32 mb-2" />
                    ) : (
                      <>
                        <img alt="QR Code" />
                      </>
                    )}

                    <p className="text-sm font-bold text-orange-500">
                      QR code helps people follow you quickly
                    </p>
                    <button
                      onClick={handleDownload}
                      className="p-2 mt-2 transition-colors bg-orange-100 border-none rounded-full hover:bg-orange-200"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-orange-400"
                      >
                        <path
                          d="M12 4v12m0 0l-4-4m4 4l4-4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 16.8v.8a2.4 2.4 0 0 0 2.4 2.4h11.2a2.4 2.4 0 0 0 2.4-2.4v-.8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs & Content */}
              <div className="flex-1 bg-white shadow-sm rounded-3xl">
                <div className="border-b">
                  <div className="flex items-center justify-between pr-4">
                    <TabUserInfo
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                    {activeTab === "information" && (
                      <Button
                        variant="ghost"
                        className="text-blue-600 bg-white hover:text-blue-700"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "information" ? (
                    <form onSubmit={handleSubmitInfo} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-left">
                            Name
                          </label>
                          {userInfo ? (
                            <Input
                              value={userInfo.name}
                              onChange={(e) =>
                                setUserInfo({
                                  ...userInfo,
                                  name: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="bg-gray-50 text-regal-blue"
                            />
                          ) : (
                            <Input
                              value={"Loading..."}
                              disabled={!isEditing}
                              className="bg-gray-50 text-regal-blue"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-left">
                            Email
                          </label>
                          <Input
                            value={userInfo.username}
                            // onChange={(e) =>
                            //   setUserInfo({
                            //     ...userInfo,
                            //     username: e.target.value,
                            //   })
                            // }
                            disabled={true}
                            className="bg-gray-50 text-regal-blue"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-left">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <Input
                              type="date"
                              value={dateOfBirth}
                              onChange={handleDateChange}
                              disabled={!isEditing}
                              className="bg-gray-50 text-regal-blue"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-left">
                            Gender
                          </label>
                          <Select
                            value={userInfo.gender ? "true" : "false"}
                            onValueChange={(value) =>
                              setUserInfo({
                                ...userInfo,
                                gender: value === "true",
                              })
                            }
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="bg-gray-50 text-regal-blue">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="false">Male</SelectItem>
                              <SelectItem value="true">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-left">
                          Phone number
                        </label>
                        <Input
                          value={userInfo.phoneNumber}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              phoneNumber: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="bg-gray-50 text-regal-blue"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-left">
                          Your hobbies
                        </label>
                        <MultiSelect
                          disabled={!isEditing}
                          options={availableHobbies}
                          onValueChange={(value) =>
                            setUserInfo({ ...userInfo, hobbies: value })
                          }
                          defaultValue={userInfo.hobbies}
                          placeholder="Select options"
                          variant="inverted"
                          animation={2}
                          maxCount={3}
                        />
                      </div>
                      {isEditing && (
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="max-w-md mx-auto">
                      <h2 className="flex items-center justify-center gap-2 mb-6 text-xl font-semibold text-regal-blue">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="text-blue-600"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                            strokeWidth="2"
                          />
                          <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
                        </svg>
                        Change password
                      </h2>

                      <form
                        onSubmit={handleSubmitPassword}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block mb-1 text-sm font-bold text-left text-gray-700">
                            Current password
                          </label>
                          <Input
                            type="password"
                            name="currentPassword"
                            placeholder="Enter current password"
                            className="w-full bg-gray-100 rounded-full"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-bold text-left text-gray-700">
                            New password
                          </label>
                          <Input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            className="w-full bg-gray-100 rounded-full"
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-bold text-left text-gray-700">
                            Confirm password
                          </label>
                          <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter confirm password"
                            className="w-full bg-gray-100 rounded-full"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters long,
                            containing uppercase and lowercase letters and
                            numbers
                          </p>
                        </div>

                        <Button
                          type="submit"
                          className="w-full text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Save
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
