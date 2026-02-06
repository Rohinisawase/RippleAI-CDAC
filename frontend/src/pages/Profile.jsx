import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../app/userSlice";
import api from "../api/axios";
import { FaCamera } from "react-icons/fa";

const DEFAULT_AVATAR = "/default-avatar.png";

export default function Profile() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Load profile
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Fill form
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  if (loading || !profile) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const profileImage = profile.profilePhotoUrl
    ? `http://localhost:8081${profile.profilePhotoUrl}`
    : DEFAULT_AVATAR;

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    await api.put("/auth/user/profile", {
      name,
      phone,
      address,
    });

    setEditMode(false);
    dispatch(fetchUserProfile());
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await api.post("/auth/user/profile/photo", formData);
    dispatch(fetchUserProfile());
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex gap-6 items-center">
          {/* ================= PHOTO ================= */}
          <div className="relative w-[120px] h-[120px]">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />

            <label className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <FaCamera size={14} className="text-white" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex-1">
            {editMode ? (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full mb-3 px-3 py-2 border rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full mb-3 px-3 py-2 border rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full mb-4 px-3 py-2 border rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md
                               hover:bg-blue-700 transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="border border-gray-400 text-gray-600 px-4 py-2 rounded-md
                               hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-xl font-semibold">{profile.name}</h4>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-gray-600">
                  {profile.phone || "No phone"}
                </p>
                <p className="text-gray-600 mb-4">
                  {profile.address || "No address"}
                </p>

                <button
                  onClick={() => setEditMode(true)}
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md
                             hover:bg-blue-600 hover:text-white transition"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
