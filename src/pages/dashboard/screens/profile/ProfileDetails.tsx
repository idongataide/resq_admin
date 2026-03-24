import React, { useRef, useState, useEffect } from "react";
import { Modal, Input, Button, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FiX } from "react-icons/fi";
import Images from "@/components/images";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useAdminProfile } from "@/hooks/useProfile";
import { updateProfile } from "@/api/profileApi";
import toast from "react-hot-toast";


const { Option } = Select;

interface ProfileFormData {
  full_name: string;
  email: string;
  gender: string;
  phone_number: string;
  avatar?: File | null;
}

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("Select a file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: profile, isLoading, mutate } = useAdminProfile();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    email: "",
    gender: "",
    phone_number: "",
    avatar: null
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        gender: profile.gender || "",
        phone_number: profile.phone_number || "",
        avatar: null
      });
    }
  }, [profile]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFile(file);
      setFormData({ ...formData, avatar: file });
    }
  };
    const handleUpdate = async () => {
    try {
        setIsUpdating(true);

        const submitData = new FormData();
        submitData.append("full_name", formData.full_name);
        submitData.append("email", formData.email);
        submitData.append("gender", formData.gender || "");
        submitData.append("phone_number", formData.phone_number || "");

        if (selectedFile) {
        submitData.append("avatar", selectedFile);
        }

        const res = await updateProfile(submitData);

        if (res?.status === "ok") {
            toast.success("Profile updated successfully!");
            mutate(); // Refresh profile data
            setIsModalOpen(false);
        }
            else {
            const errorMsg = res?.response?.data?.msg || "Failed to update profile. Please try again.";
            toast.error(errorMsg);
        }

    } catch (error) {
        console.log(error);
    } finally {
        setIsUpdating(false);
    }
    };
  const handleCancel = () => {
    setIsModalOpen(false);
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        gender: profile.gender || "",
        phone_number: profile.phone_number || "",
        avatar: null
      });
    }
    setSelectedFileName("Select a file");
    setSelectedFile(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#fff] rounded-2xl p-6">
      <div className="flex justify-between items-start mb-3">   
        <div className="flex items-center gap-4">
          <img 
            src={profile?.avatar || Images.user} 
            alt="Profile" 
            className="w-15 h-15 rounded-lg" 
          />
        </div>
            
        <Button
          icon={<EditOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FDF2F2]! text-[#DB4A47]! border-0! font-medium!"
        >
          Edit
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex-1 grid grid-cols-4 gap-10">
        <div>
          <p className="text-sm text-[#354959]">Name</p>
          <p className="font-medium text-[#354959]">{profile?.full_name}</p>
        </div>

        <div>
          <p className="text-sm text-[#354959]">Phone Number</p>
          <p className="font-medium text-[#354959]">{profile?.phone_number || "Not provided"}</p>
        </div>

        <div>
          <p className="text-sm text-[#354959]">Email</p>
          <p className="font-medium text-[#354959]">{profile?.email}</p>
        </div>

        <div>
          <p className="text-sm text-[#354959]">Gender</p>
          <p className="font-medium text-[#354959] capitalize">{profile?.gender || "Not provided"}</p>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={500}
        closeIcon={<FiX className="text-[#354959]" />}
      >
        {/* Custom Header */}
        <div className="bg-[#F3F5F9] px-6 py-6 mb-6 rounded-t-lg">
          <h2 className="text-xl font-semibold text-[#000A0F]">
            Edit Profile
          </h2>
        </div>

        <div className="space-y-5 p-6">
          {/* Name */}
          <div>
            <p className="text-sm mb-1 text-[#354959]">Name</p>
            <Input
              size="large"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <p className="text-sm mb-1 text-[#354959]">Email</p>
            <Input
              size="large"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Phone Number + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 text-[#354959]">Phone Number</p>
              <Input
                size="large"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone_number: e.target.value,
                  })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <p className="text-sm mb-1 text-[#354959]">
                Gender (optional)
              </p>
              <Select
                size="large"
                value={formData.gender || undefined}
                onChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                className="w-full"
                placeholder="Select gender"
                allowClear
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </div>
          </div>

          {/* Upload */}
          <div>
            <p className="text-sm mb-1 text-[#354959]">
              Upload Profile Image
            </p>

            <div className="border rounded-lg p-3 flex justify-between items-center">
              <span className="text-gray-400 truncate">
                {selectedFileName}
              </span>

              <Button
                type="text"
                onClick={handleFileClick}
                className="text-[#DB4A47]! font-medium!"
                icon={<AiOutlineCloudUpload className="w-6 h-6" />}
              >
                Select File
              </Button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              size="large"
              onClick={handleCancel}
              className="px-8 bg-[#F3EAEA]! text-[#DB4A47]! border-0!"
            >
              Cancel
            </Button>

            <Button
              size="large"
              onClick={handleUpdate}
              loading={isUpdating}
              className="px-8 bg-[#DB4A47]! text-white! border-0!"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;