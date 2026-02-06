import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Wand2 } from "lucide-react";
import CampaignPostsReview from "./CampaginPostReview";

const GenerateCampaign = () => {
  const [prompt, setPrompt] = useState("");
  const [campaignId, setCampaignId] = useState(localStorage.getItem("campaignId"));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const token = localStorage.getItem("token");

  const generatePosts = async () => {
    if (!prompt.trim()) {
      setStatus({ type: "error", msg: "Please describe your campaign goals." });
      return;
    }

    setLoading(true);
    setStatus({ type: "loading", msg: "AI is crafting your social media strategy..." });

    const newCampaignId = crypto.randomUUID();
    
    try {
      const res = await fetch("http://localhost:8015/ngo/posts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt,
          ownerType: "NGO",
          ownerId: "12345", // Replace with real ID from context/token
          postType: "CAMPAIGN",
          campaignId: newCampaignId
        })
      });

      if (!res.ok) throw new Error("Generation failed. Please try a different prompt.");

      localStorage.setItem("campaignId", newCampaignId);
      setCampaignId(newCampaignId);
      setStatus({ type: "success", msg: "Campaign generated successfully!" });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
      setCampaignId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles size={14} /> AI Social Media Manager
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Generate Your Campaign</h1>
          <p className="text-slate-500 text-lg">Describe your cause, and our AI will handle the content, tags, and visuals.</p>
        </div>

        {/* Generator Box */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 mb-12">
          <div className="relative group">
            <textarea
              className="w-full min-h-[160px] text-lg bg-slate-50 border-none rounded-xl p-6 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 outline-none resize-none"
              placeholder="Example: Create a campaign for civic sense in societies in pune region..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
              {prompt.length} characters
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              {status.type === 'error' && <span className="text-rose-500 flex items-center gap-1 font-medium"><AlertCircle size={16}/> {status.msg}</span>}
              {status.type === 'success' && <span className="text-emerald-600 flex items-center gap-1 font-medium"><CheckCircle2 size={16}/> {status.msg}</span>}
              {status.type === 'loading' && <span className="text-indigo-600 flex items-center gap-1 font-medium animate-pulse"><Loader2 size={16} className="animate-spin"/> {status.msg}</span>}
            </div>

            <button
              onClick={generatePosts}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:hover:bg-slate-900"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              {loading ? "Creating..." : "Generate Strategy"}
            </button>
          </div>
        </div>

        {/* Content Section */}
        {campaignId && !loading ? (
          <CampaignPostsReview campaignId={campaignId} />
        ) : loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse flex flex-col p-6 gap-4">
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
                <div className="h-32 w-full bg-slate-50 rounded-xl" />
                <div className="flex gap-2">
                   <div className="h-8 w-20 bg-slate-100 rounded" />
                   <div className="h-8 w-20 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GenerateCampaign;