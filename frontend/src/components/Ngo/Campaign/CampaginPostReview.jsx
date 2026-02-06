import React, { useEffect, useState } from "react";
import { 
  CheckCircle, XCircle, Music, Hash, Layout, 
  ArrowRight, ThumbsUp, Trash, Clock, ExternalLink 
} from "lucide-react";

const CampaignPostsReview = ({ campaignId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8015/ngo/posts/campaign/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      setError("Unable to load posts. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [campaignId]);

  const approvePost = async (id) => {
    try {
      await fetch(`http://localhost:8015/ngo/posts/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (e) { setError("Approval failed"); }
  };

  const rejectPost = async (id) => {
    try {
      await fetch(`http://localhost:8015/ngo/posts/${id}/reject`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (e) { setError("Rejection failed"); }
  };

  const submitCampaign = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8015/ngo/posts/submit?ngoId=12345&campaignId=${campaignId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem("campaignId");
      window.location.reload();
    } catch (e) {
      setError("Final submission failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const approvedCount = posts.filter(p => p.status === "SCHEDULED").length;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layout size={20} className="text-indigo-500" />
          Review Generated Content
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {posts.length} Drafts Generated
        </span>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex items-center gap-2">
          <XCircle size={16} /> {error}
        </div>
      )}

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${post.status === 'SCHEDULED' ? 'border-emerald-200 ring-4 ring-emerald-50' : 'border-slate-200'}`}>
            
            <div className="flex flex-col md:flex-row">
              {/* Media Preview */}
              <div className="w-full md:w-64 h-64 md:h-auto relative bg-slate-100">
                {post.postLink ? (
                  <img src={post.postLink} alt="Post" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Layout size={40} />
                  </div>
                )}
                {post.status === 'SCHEDULED' && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle size={18} />
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="flex-1 p-6 space-y-4">
                <div className="flex items-start justify-between">
                   <p className="text-slate-800 text-base leading-relaxed whitespace-pre-line font-medium">
                    {post.caption}
                  </p>
                </div>

                {/* Music Player */}
                {post.musicLink && (
                  <div className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                      <Music size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">Recommended Audio</p>
                      <audio controls className="h-8 w-full mt-1 accent-indigo-600">
                        <source src={post.musicLink} type="audio/mpeg" />
                      </audio>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        <Hash size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  {post.status !== "SCHEDULED" ? (
                    <button
                      onClick={() => approvePost(post.id)}
                      className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <ThumbsUp size={16} /> Approve Draft
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">
                      <CheckCircle size={16} /> Ready to Post
                    </div>
                  )}

                  <button
                    onClick={() => rejectPost(post.id)}
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Trash size={16} /> Reject
                  </button>

                  <div className="ml-auto flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} /> {post.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Submission Bar */}
      {approvedCount > 0 && (
        <div className="sticky bottom-6 left-0 right-0 bg-slate-900 rounded-2xl p-4 shadow-2xl shadow-indigo-500/20 flex items-center justify-between border border-white/10 animate-in fade-in slide-in-from-bottom-10">
          <div className="hidden sm:block pl-4">
            <h4 className="text-white font-bold">Launch Campaign</h4>
            <p className="text-slate-400 text-xs">{approvedCount} out of {posts.length} posts approved</p>
          </div>
          <button
            onClick={submitCampaign}
            disabled={submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-3 rounded-xl font-extrabold transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Finalizing..." : "Submit Campaign"}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignPostsReview;