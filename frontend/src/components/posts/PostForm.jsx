import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUserPost } from "../../app/postSlice";
import { FaCamera, FaFileUpload } from "react-icons/fa";

export default function PostForm({ onClose }) {
  const dispatch = useDispatch();

  const [caption, setCaption] = useState("");
  const [postLink, setPostLink] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  /* ---------------- FILE UPLOAD ---------------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostLink(URL.createObjectURL(file));
      stopCamera();
    }
  };

  /* ---------------- CAMERA (OLD LOGIC – FIXED) ---------------- */
  const openCamera = async () => {
    try {
      setShowCamera(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.log("Error:",err);
      alert("Camera permission denied");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL("image/png");

    setPostLink(imageUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createUserPost({
        ownerId: localStorage.getItem("email"),
        postData: { caption, postLink },
      })
    );

    setCaption("");
    setPostLink("");
    stopCamera();
    onClose();
  };

  /* CLEANUP */
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
      <textarea
        className="form-control border-0 mb-3"
        rows="3"
        placeholder="Write something..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        autoFocus
        required
      />

      {/* IMAGE PREVIEW */}
      {postLink && (
        <img
          src={postLink}
          alt="preview"
          className="img-fluid rounded mb-3"
        />
      )}

      {/* CAMERA PREVIEW */}
      {showCamera && (
        <div className="mb-3 text-center">
          <video
            ref={videoRef}
            autoPlay
            className="rounded w-100 mb-2"
          />
          <canvas ref={canvasRef} hidden />

          <button
            type="button"
            className="btn btn-success me-2"
            onClick={capturePhoto}
          >
            Capture
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={stopCamera}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          {/* FILE */}
          <button
            type="button"
            className="btn btn-light"
            onClick={() => fileInputRef.current.click()}
          >
            <FaFileUpload />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
          />

          {/* CAMERA */}
          <button
            type="button"
            className="btn btn-light"
            onClick={openCamera}
          >
            <FaCamera />
          </button>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-outline-primary me-2"
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="btn btn-primary">Post</button>
        </div>
      </div>
    </form>
  );
}
