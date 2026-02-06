import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, X } from "lucide-react";
import MusicSelector from "./MusicSelector";
import { fetchSongs } from "../../../api/UserApis/songApi";

const PostForm = ({ image, onSubmit, onCancel }) => {
  const [caption, setCaption] = useState("");
  const [music, setMusic] = useState(null);
  const [musicList, setMusicList] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  useEffect(() => {
    const loadSongs = async () => {
      setLoadingSongs(true);
      const songs = await fetchSongs();
      setMusicList(songs);
      setLoadingSongs(false);
    };

    loadSongs();
  }, []);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={onCancel} className="text-gray-500">
          <X />
        </button>

        <span className="font-bold text-lg">New Post</span>

        <button
          onClick={() => onSubmit({ caption, musicLink: music?.url })}
          className="text-blue-500 font-semibold text-lg"
        >
          Share
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Image Preview & Caption */}
        <div className="flex p-4 gap-4 items-start border-b">
          <img
            src={image}
            className="w-24 h-24 object-cover rounded-lg shadow-md"
            alt="Post"
          />
          <textarea
            placeholder="Write a caption..."
            className="flex-1 h-24 p-2 text-gray-800 resize-none focus:outline-none"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Music Selector */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
            <Music size={20} className="text-blue-500" />
            <span>Add Music</span>
          </div>

          {loadingSongs ? (
            <p className="text-sm text-gray-400">Loading songs...</p>
          ) : (
            <MusicSelector
              musicList={musicList}
              selectedMusic={music}
              onSelect={setMusic}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostForm;
