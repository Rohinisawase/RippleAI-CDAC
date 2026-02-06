import { useState, useEffect, useRef } from "react";
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Music, Play, Pause, Smile 
} from "lucide-react";
import { fetchEngagement, toggleLike, addComment } from "../../api/feedApis/feed";

export default function FeedCard({ post, isActive, user }) {
  const userId = user?.id;

  // State
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef(null);

  // Fetch engagement on mount
  useEffect(() => {
    const loadEngagement = async () => {
      const data = await fetchEngagement(post.postId);
      setLikesCount(data.likes || 0);
      setComments(data.comments || []);
    };
    loadEngagement();
  }, [post.postId]);

  // Auto-play audio if this post is active
  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive && post.musicLink) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, post.musicLink]);

  const handleToggleLike = async () => {
    if (!userId) return;

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(!liked ? likesCount + 1 : likesCount - 1);

    const success = await toggleLike(post.postId, userId);
    if (!success) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userId) return;

    const newComment = {
      user: user.name || "You",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText("");

    const success = await addComment(post.postId, userId, newComment.text);
    if (!success) {
      console.error("Failed to add comment");
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <article className="bg-white border-b border-gray-200 sm:border sm:rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-4">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
            <div className="bg-white p-[2px] rounded-full">
              <img
                src={post.ownerAvatar || `https://i.pravatar.cc/150?u=${post.ownerId}`} 
                className="w-8 h-8 rounded-full object-cover" alt="avatar"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center leading-none">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-gray-900 hover:opacity-70 cursor-pointer">
                {post.ownerId}
              </span>
              {post.ownerType === "NGO" && (
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1 rounded font-medium border border-blue-100">
                  NGO
                </span>
              )}
              <span className="text-gray-400 text-xs">• {getRelativeTime(post.createdAt)}</span>
            </div>
            {post.musicLink && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-900 cursor-pointer" onClick={toggleAudio}>
                <Music size={10} className="text-gray-500" />
                <span className="truncate max-w-[150px]">Original Audio • {post.ownerId}</span>
              </div>
            )}
          </div>
        </div>
        <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-900" size={20} />
      </div>

      {/* MEDIA */}
      <div className="relative bg-gray-100 w-full aspect-square overflow-hidden group">
        <img src={post.postLink || "https://via.placeholder.com/600"} alt="Post content" 
             className="w-full h-full object-cover" onDoubleClick={handleToggleLike} />
        {post.musicLink && <audio ref={audioRef} src={post.musicLink} loop />}
        {post.musicLink && (
          <button onClick={toggleAudio} className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white hover:scale-105 transition-transform">
            {isPlaying ? <Pause size={14} fill="white"/> : <Play size={14} fill="white"/>}
          </button>
        )}
      </div>

      {/* ACTIONS + COMMENTS */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleToggleLike} className="transition-transform active:scale-90 hover:opacity-60">
              <Heart size={26} className={liked ? "fill-red-500 text-red-500" : "text-black"} strokeWidth={liked ? 0 : 1.5}/>
            </button>
            <button className="hover:opacity-60 -rotate-90">
              <MessageCircle size={26} className="text-black" strokeWidth={1.5}/>
            </button>
            <button className="hover:opacity-60">
              <Send size={26} className="text-black" strokeWidth={1.5}/>
            </button>
          </div>
          <button className="hover:opacity-60">
            <Bookmark size={26} className="text-black" strokeWidth={1.5}/>
          </button>
        </div>

        <div className="font-semibold text-sm mb-2 text-gray-900">{likesCount.toLocaleString()} likes</div>
        <div className="text-sm text-gray-900 mb-1">
          <span className="font-semibold mr-2 cursor-pointer hover:opacity-70">{post.ownerId}</span>
          <span className={`${!isExpanded ? 'line-clamp-2' : ''} inline`}>{post.caption}</span>
          {post.caption?.length > 80 && !isExpanded && (
            <button onClick={() => setIsExpanded(true)} className="text-gray-500 text-xs ml-1 hover:text-gray-900">more</button>
          )}
        </div>

        {/* Recent comments */}
        <div className="space-y-1 mb-2">
          {comments.slice(-2).map((c, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold mr-2 text-sm">{c.user}</span>
              <span className="text-gray-800">{c.text}</span>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <form onSubmit={handleAddComment} className="border-t border-gray-100 px-3 py-3 flex items-center gap-3">
          <Smile className="text-gray-400 cursor-pointer hover:text-gray-600" size={24} />
          <input type="text" placeholder="Add a comment..." className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
            value={commentText} onChange={(e) => setCommentText(e.target.value)} />
          {commentText.trim().length > 0 && (
            <button type="submit" className="text-blue-500 font-semibold text-sm hover:text-blue-700 transition-colors">Post</button>
          )}
        </form>
      </div>
    </article>
  );
}
