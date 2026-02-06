import axios from "../axios";


// helper for handling responses
const handleResponse = (res) => {
  // 204 No Content
  if (res.status === 204) {
    return null;
  }

  return res.data ?? null;
};

// helper for handling errors (optional but clean)
const handleError = (error) => {
  if (error.response) {
    // backend responded with error status
    throw new Error(
      error.response.data?.message ||
      error.response.data ||
      "Request failed"
    );
  }

  // network / axios error
  throw new Error(error.message || "Network error");
};

// ---------------- GET CAMPAIGNS BY NGO ----------------
export const getCampaignsByNgo = async (ngoId) => {
  try {
    const res = await api.get(`/ngo/campaigns/ngo/${ngoId}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};

// ---------------- DELETE A SINGLE POST ----------------
export const deletePost = async (postId) => {
  try {
    const res = await api.delete(`/ngo/campaigns/posts/${postId}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};

// ---------------- DELETE ENTIRE CAMPAIGN ----------------
export const deleteCampaign = async (campaignId) => {
  try {
    const res = await api.delete(`/ngo/campaigns/${campaignId}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};
