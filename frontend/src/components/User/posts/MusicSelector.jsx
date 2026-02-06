import React, { useState, useRef } from "react";
import { Music, Check, Search, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";

const MusicSelector = ({ musicList, selectedMusic, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const audioRef = useRef(null);

  const handleSelect = (song) => {
    // If clicking the same song → toggle play/pause
    if (selectedMusic?.id === song.id && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
      return;
    }

    // New song selected
    onSelect(song);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = song.url;
      audioRef.current.play().catch(() => {});
    }
  };

  const filteredMusic = musicList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-h-[400px]">
      {/* Search */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search music..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {filteredMusic.length ? (
          filteredMusic.map((m) => {
            const isSelected = selectedMusic?.id === m.id;
            const isPlaying =
              isSelected && audioRef.current && !audioRef.current.paused;

            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isPlaying ? <Pause size={18} /> : <Music size={18} />}
                  </div>

                  <div className="text-left">
                    <p
                      className={`font-semibold text-sm ${
                        isSelected ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500">{m.artist}</p>
                  </div>
                </div>

                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={18} className="text-blue-500" />
                  </motion.div>
                )}
              </button>
            );
          })
        ) : (
          <div className="py-10 text-center text-gray-400 text-sm italic">
            No music found...
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicSelector;
