import { useEffect, useState } from "react";
import {
  getNGOProfile,
  updateNGOProfile,
  updateNGOProfilePhoto,
  changeNGOPassword,
  deleteNGOAccount,
} from "../../api/NgoApis/ngoProfile.js";

import Sidebar from "../Sidebar/Sidebar.jsx";
import EditProfileTab from "../common/EditProfileTab.jsx";
import PasswordTab from "../common/PasswordTab.jsx";
import DangerZoneTab from "../common/DangerZoneTab.jsx";
import NgoCampaigns from "./Campaign/NgoCampaigns.jsx";
import GenerateCampaign from "./Campaign/GenerateCampaign.jsx";

import { useUI } from "../context/UIContext.jsx"; // Context import
import Feed from "../Feed/Feed.jsx";

import { CheckCircle2, AlertCircle } from "lucide-react";



const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const bg = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-slate-800",
  };

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-3 rounded-lg shadow-xl text-white z-50 ${bg[type]}`}>
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};


const NGOProfileDashboard = () => {
  const { activeTab } = useUI(); // Use context instead of props

  console.log({ activeTab })
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type) => setToast({ message, type });

  useEffect(() => {
    getNGOProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <div className="w-full p-8 mt-8 bg-gray-50">
      <Toast {...toast} onClose={() => setToast({ message: "" })} />

      <div className="flex bg-white rounded-xl  min-h-[600px]">
        <Sidebar />

        <div className="flex-1  overflow-y-auto">

          {activeTab === "feed" && (<Feed />)}

          {activeTab === "generate" && (<GenerateCampaign />)}

          {activeTab === "campaign" && <NgoCampaigns ngoId={12345} />}

          {activeTab === "edit" && (
            <EditProfileTab
              profile={profile}
              setProfile={setProfile}
              previewPhoto={previewPhoto}
              onPhotoSelect={(e) => {
                setNewPhoto(e.target.files[0]);
                setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
              }}
              onSave={() => { }}
              isSaving={isSaving}
            />
          )}

          {activeTab === "password" && (
            <PasswordTab
              passwords={passwords}
              setPasswords={setPasswords}
              onSave={async () => {
                try {
                  setIsSaving(true);

                  if (newPhoto) {
                    await updateNGOProfilePhoto(newPhoto);
                  }

                  await updateNGOProfile(profile);

                  showToast("Profile updated successfully", "success");
                } catch (err) {
                  console.error(err);
                  showToast("Failed to update profile", "error");
                } finally {
                  setIsSaving(false);
                }
              }}
              isSaving={isSaving}
            />
          )}

          {activeTab === "danger" && (
            <DangerZoneTab onDelete={deleteNGOAccount} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOProfileDashboard;
