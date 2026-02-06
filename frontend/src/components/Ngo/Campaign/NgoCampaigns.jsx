import { useEffect, useState } from "react";
import { 
  Trash2, Calendar, Image as ImageIcon, Layers, 
  MoreHorizontal, Clock, AlertCircle, CheckCircle2 
} from "lucide-react";
import {
  getCampaignsByNgo,
  deletePost,
  deleteCampaign,
} from "../../../api/NgoApis/campaignApi";

const NgoCampaigns = ({ ngoId }) => {
  const [campaigns, setCampaigns] = useState({});
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  const fetchCampaigns = async () => {
    try {
      const res = await getCampaignsByNgo(ngoId);
      setCampaigns(res || {}); 
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ngoId) fetchCampaigns();
  }, [ngoId]);

  // --- Handlers ---
  const handleDeletePost = async (postId, campaignId) => {
    if (!window.confirm("Are you sure you want to remove this post?")) return;
    try {
      await deletePost(postId);
      // Optimistic UI Update (faster than re-fetching)
      setCampaigns(prev => ({
        ...prev,
        [campaignId]: prev[campaignId].filter(p => p.id !== postId)
      }));
    } catch (err) {
      alert("Failed to delete post");
      fetchCampaigns(); // Revert on error
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm("Warning: This will delete the entire campaign and all its posts. Continue?")) return;
    try {
      await deleteCampaign(campaignId);
      // Optimistic UI Update
      const newCampaigns = { ...campaigns };
      delete newCampaigns[campaignId];
      setCampaigns(newCampaigns);
    } catch (err) {
      alert("Failed to delete campaign");
      fetchCampaigns();
    }
  };

  // --- Render Helpers ---

  if (loading) return <CampaignSkeleton />;

  if (!campaigns || Object.keys(campaigns).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Layers className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Campaigns Yet</h3>
        <p className="text-gray-500 max-w-sm mt-1">Start a new campaign to organize your posts and track their performance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Campaign Manager</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your active social media drives and scheduled content.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <Layers size={16} />
          <span>{Object.keys(campaigns).length} Active Campaigns</span>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-10">
        {Object.entries(campaigns).map(([campaignId, posts = []]) => (
          <CampaignGroup 
            key={campaignId}
            campaignId={campaignId}
            posts={posts}
            onDeleteCampaign={() => handleDeleteCampaign(campaignId)}
            onDeletePost={(postId) => handleDeletePost(postId, campaignId)}
          />
        ))}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const CampaignGroup = ({ campaignId, posts, onDeleteCampaign, onDeletePost }) => {
  // Calculate stats
  const scheduledCount = posts.filter(p => new Date(p.scheduledAt) > new Date()).length;
  const postedCount = posts.length - scheduledCount;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      
      {/* Campaign Header Bar */}
      <div className="bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
            #{campaignId.slice(-3)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              Campaign <span className="text-gray-400 font-normal normal-case">ID: {campaignId}</span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1"><ImageIcon size={12}/> {posts.length} Posts</span>
              <span className="flex items-center gap-1 text-amber-600"><Clock size={12}/> {scheduledCount} Scheduled</span>
              <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12}/> {postedCount} Live</span>
            </div>
          </div>
        </div>

        <button
          onClick={onDeleteCampaign}
          className="group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-md transition-all duration-200"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Delete Campaign</span>
        </button>
      </div>

      {/* Posts Grid */}
      <div className="p-6">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic">This campaign is empty.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={() => onDeletePost(post.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PostCard = ({ post, onDelete }) => {
  const isScheduled = post.scheduledAt && new Date(post.scheduledAt) > new Date();
  
  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={post.postLink || "https://via.placeholder.com/300"}
          alt="Campaign Asset"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {isScheduled ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100/90 backdrop-blur-sm text-amber-700 text-[10px] font-bold shadow-sm">
              <Clock size={10} />
              WAITING
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold shadow-sm">
              <CheckCircle2 size={10} />
              LIVE
            </span>
          )}
        </div>

        {/* Delete Overlay (Visible on Hover) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={onDelete}
            className="bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition transform hover:scale-110"
            title="Delete Post"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3">
        <p className="text-gray-800 text-xs font-medium line-clamp-2 min-h-[2.5em] leading-relaxed">
          {post.caption || "No caption provided"}
        </p>
        
        <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            {post.scheduledAt 
              ? new Date(post.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : "Now"
            }
          </div>
          {post.scheduledAt && (
             <span>{new Date(post.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CampaignSkeleton = () => (
  <div className="space-y-8">
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
    {[1, 2].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default NgoCampaigns;