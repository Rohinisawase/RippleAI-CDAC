import { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePhoto,
  changeUserPassword,
  deleteUserAccount,
} from "../../api/UserApis/userProfile.js";

import Feed from "../Feed/Feed.jsx";
import CreatePosts from "./posts/CreatePosts.jsx";
import EditProfileTab from "../common/EditProfileTab.jsx";
import PasswordTab from "../common/PasswordTab.jsx";
import DangerZoneTab from "../common/DangerZoneTab.jsx";
import ManagePosts from "./posts/ManagePosts.jsx";

import { useUI } from "../context/UIContext.jsx";
import { CheckCircle2, AlertCircle } from "lucide-react";

/* ===================== TOAST ===================== */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bg = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-slate-800",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-3 rounded-lg shadow-xl text-white z-50 ${bg[type]}`}
    >
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

/* ===================== DASHBOARD ===================== */
const UserProfileDashboard = () => {
  const { activeTab } = useUI();

  console.log({"sdsd" : activeTab})
  const [profile, setProfile] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "info") =>
    setToast({ message, type });

  /* ===================== LOAD PROFILE ===================== */
  useEffect(() => {
    getUserProfile()
      .then(setProfile)
      .catch(() => showToast("Failed to load profile", "error"));
  }, []);

  if (!profile) return null;

  return (
    <div className="flex flex-col bg-white rounded-xl min-h-[600px] p-6 gap-6">
      <Toast {...toast} onClose={() => setToast({ message: "", type: "" })} />

      {activeTab === "feed" && (
        <>
          <h1 className="text-xl font-semibold mb-4">Feed</h1>
          <Feed />
        </>
      )}

      {activeTab === "createPost" && <CreatePosts />}

      {activeTab === "managePosts" && <ManagePosts ownerId={profile.id} />}

      {activeTab === "edit" && (
        <EditProfileTab
          profile={profile}
          setProfile={setProfile}
          previewPhoto={previewPhoto}
          isSaving={isSaving}
          onPhotoSelect={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setNewPhoto(file);
            setPreviewPhoto(URL.createObjectURL(file));
          }}
          onSave={async () => {
            try {
              setIsSaving(true);
              if (newPhoto) await updateUserProfilePhoto(newPhoto);
              const updated = await updateUserProfile(profile);
              setProfile(updated);
              showToast("Profile updated successfully", "success");
            } catch {
              showToast("Failed to update profile", "error");
            } finally {
              setIsSaving(false);
            }
          }}
        />
      )}

      {activeTab === "password" && (
        <PasswordTab
          passwords={passwords}
          setPasswords={setPasswords}
          isSaving={isSaving}
          onSave={async () => {
            if (!passwords.current || !passwords.new || !passwords.confirm) {
              showToast("Please fill all fields", "error");
              return;
            }
            if (passwords.new !== passwords.confirm) {
              showToast("Passwords do not match", "error");
              return;
            }
            try {
              setIsSaving(true);
              await changeUserPassword({
                oldPassword: passwords.current,
                newPassword: passwords.new,
              });
              showToast("Password changed successfully", "success");
              setPasswords({ current: "", new: "", confirm: "" });
            } catch (err) {
              showToast(err.message, "error");
            } finally {
              setIsSaving(false);
            }
          }}
        />
      )}

      {activeTab === "danger" && (
        <DangerZoneTab
          onDelete={async () => {
            try {
              await deleteUserAccount();
              showToast("Account deleted successfully", "success");
            } catch {
              showToast("Failed to delete account", "error");
            }
          }}
        />
      )}
    </div>
  );
};

export default UserProfileDashboard;
