import { Camera, Loader2 } from "lucide-react";
import FormGroup from "./FormGroup";

const BASE_PHOTO_URL =
  "https://rippleaibucket.s3.eu-north-1.amazonaws.com/";

const EditProfileTab = ({
  profile,
  previewPhoto,
  isSaving,
  onPhotoSelect,
  onSave,
  setProfile,
}) => {
  const profilePhotoUrl =
    previewPhoto ||
    (profile?.profilePhotoUrl
      ? `${BASE_PHOTO_URL}${profile.profilePhotoUrl}`
      : "https://via.placeholder.com/150");

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-2xl">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="relative group shrink-0">
          <img
            src={profilePhotoUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
            <Camera size={18} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onPhotoSelect}
            />
          </label>
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-900">
            {profile.email}
          </p>
          <label className="text-sm text-blue-600 hover:underline cursor-pointer">
            Change profile photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onPhotoSelect}
            />
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Form */}
      <div className="space-y-8">
        <FormGroup label="NGO Name">
          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            className="input-field"
          />
        </FormGroup>

        <FormGroup label="Phone Number">
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
            className="input-field"
          />
        </FormGroup>

        <FormGroup label="Address">
          <textarea
            rows={3}
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="input-field resize-none"
          />
        </FormGroup>
      </div>

      {/* Action */}
      <div className="pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default EditProfileTab;
