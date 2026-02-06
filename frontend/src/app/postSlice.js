// // src/app/postSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import postApi from "../api/postApi";

// export const fetchUserPosts = createAsyncThunk(
//   "posts/fetchUserPosts",
//   async (ownerId, { rejectWithValue }) => {
//     try {
//       const res = await postApi.get(`/user/posts?ownerId=${ownerId}&ownerType=USER`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// export const createUserPost = createAsyncThunk(
//   "posts/createUserPost",
//   async ({ ownerId, postData }, { rejectWithValue }) => {
//     try {
//       await postApi.post("/user/posts", {
//         ownerId,
//         ownerType: "USER",
//         postType: "NORMAL",
//         posts: [postData],
//       });
//       return postData;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// export const updateUserPost = createAsyncThunk(
//   "posts/updateUserPost",
//   async ({ ownerId, postId, postData }, { rejectWithValue }) => {
//     try {
//       await postApi.put(`/user/posts/${postId}?ownerId=${ownerId}&ownerType=USER`, postData);
//       return { postId, postData };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// export const deleteUserPost = createAsyncThunk(
//   "posts/deleteUserPost",
//   async ({ ownerId, postId }, { rejectWithValue }) => {
//     try {
//       await postApi.delete(`/user/posts/${postId}?ownerId=${ownerId}&ownerType=USER`);
//       return postId;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// const postSlice = createSlice({
//   name: "posts",
//   initialState: {
//     posts: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // FETCH
//       .addCase(fetchUserPosts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserPosts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.posts = action.payload;
//       })
//       .addCase(fetchUserPosts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // CREATE
//       .addCase(createUserPost.fulfilled, (state, action) => {
//         state.posts.push(action.payload);
//       })

//       // UPDATE
//       .addCase(updateUserPost.fulfilled, (state, action) => {
//         const index = state.posts.findIndex((p) => p.postId === action.payload.postId);
//         if (index !== -1) state.posts[index] = { ...state.posts[index], ...action.payload.postData };
//       })

//       // DELETE
//       .addCase(deleteUserPost.fulfilled, (state, action) => {
//         state.posts = state.posts.filter((p) => p.postId !== action.payload);
//       });
//   },
// });

// export default postSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postApi from "../api/postApi";

// Fetch posts for logged-in user
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await postApi.get("/user/posts");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createUserPost = createAsyncThunk(
  "posts/createUserPost",
  async ({ postData }, { rejectWithValue }) => {
    try {
      await postApi.post("/user/posts", { postType: "NORMAL", posts: [postData] });
      return postData;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUserPost = createAsyncThunk(
  "posts/updateUserPost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      await postApi.put(`/user/posts/${postId}`, postData);
      return { postId, postData };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUserPost = createAsyncThunk(
  "posts/deleteUserPost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      await postApi.delete(`/user/posts/${postId}`);
      return postId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload; })
      .addCase(fetchUserPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createUserPost.fulfilled, (state, action) => { state.posts.push(action.payload); })
      .addCase(updateUserPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.postId === action.payload.postId);
        if (index !== -1) state.posts[index] = { ...state.posts[index], ...action.payload.postData };
      })
      .addCase(deleteUserPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.postId !== action.payload);
      });
  },
});

export default postSlice.reducer;
