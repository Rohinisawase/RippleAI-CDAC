import { useState, useEffect, useRef, useCallback } from "react";
import { fetchFeed } from "../../api/feedApis/feed";
import FeedCard from "./FeedCard";
import { Loader2 } from "lucide-react";

const BASE_URL = "http://localhost:8765";

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const allFetchedPosts = useRef([]);
  const activePostRef = useRef(null);
  const observerRef = useRef(null);

  // Load initial posts
  useEffect(() => { loadMore(); }, []);

  // SSE updates
  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL}/feed/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "CREATE") {
        const newPost = { ...data.post, _key: `${data.post.postId}-${Date.now()}` };
        setPosts(prev => [newPost, ...prev]);
        allFetchedPosts.current.unshift(newPost);
      }

      if (data.type === "DELETE") {
        setPosts(prev => prev.filter(p => p.postId !== data.postId));
        allFetchedPosts.current = allFetchedPosts.current.filter(p => p.postId !== data.postId);
      }
    };

    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, []);

  // Load more posts
  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const newPosts = (await fetchFeed(page)).map(p => ({ ...p, _key: p.id }));
      allFetchedPosts.current.push(...newPosts);
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      setLoading(false);
    }
  };

  // IntersectionObserver for auto-playing active post
  const observeCard = useCallback((node) => {
    if (!node) return;
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          let mostVisible = null;
          let maxRatio = 0;

          entries.forEach(entry => {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisible = entry.target.getAttribute("data-key");
            }
          });

          if (mostVisible !== activePostRef.current) {
            activePostRef.current = mostVisible;
            setPosts(prev => prev.map(p => ({ ...p, isActive: p._key === mostVisible })));
          }
        },
        { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
      );
    }
    observerRef.current.observe(node);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-[470px] space-y-6">
        {posts.map((post) => (
          <div key={post._key} data-key={post._key} ref={observeCard} className="feed-card">
            <FeedCard post={post} isActive={post.isActive} user={user} />
          </div>
        ))}

        <div ref={loaderRef} className="h-20 flex items-center justify-center">
          {loading && <Loader2 className="animate-spin text-gray-400 w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}
