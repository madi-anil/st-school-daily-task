import { useState, useEffect } from "react";
import { useFetch } from "../Hooks/usefetch";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { useWindowWidth } from "../Hooks/useWindowWidth";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export function PostExplorer() {
  const { data: posts, loading: postsLoading, error: postsError } = useFetch(
    `${BASE_URL}/posts?_limit=10`
  );
  const [selectedPostId, setSelectedPostId] = useLocalStorage(
    "selectedPostId",
    null
  );
  const width = useWindowWidth();

  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    if (!selectedPostId) {
      setPostDetail(null);
      setComments([]);
      return;
    }

    let cancelled = false;

    async function loadPostAndComments() {
      setDetailLoading(true);
      setDetailError(null);

      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`${BASE_URL}/posts/${selectedPostId}`),
          fetch(`${BASE_URL}/posts/${selectedPostId}/comments`),
        ]);

        if (!postRes.ok || !commentsRes.ok) {
          throw new Error("Failed to load post details or comments");
        }

        const [postJson, commentsJson] = await Promise.all([
          postRes.json(),
          commentsRes.json(),
        ]);

        if (!cancelled) {
          setPostDetail(postJson);
          setComments(commentsJson);
        }
      } catch (err) {
        if (!cancelled) {
          setDetailError(err.message || "Error loading post details");
        }
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    }

    loadPostAndComments();

    return () => {
      cancelled = true;
    };
  }, [selectedPostId]);

  const columns = width < 600 ? 1 : 2;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Post Explorer ({columns} col)<style>textAlign:center</style></h2>

      {postsLoading && <p>Loading posts...</p>}
      {postsError && <p>Error: {postsError}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: "12px",
        }}
      >
        {posts?.map((post) => {
          const isSelected = selectedPostId === post.id;
          return (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPostId(post.id)}
              style={{
                minWidth: 0,
                padding: "12px 14px",
                textAlign: "left",
                borderRadius: "8px",
                border: isSelected ? "2px solid #38bdf8" : "1px solid #6366f1",
                backgroundColor: isSelected ? "#1e293b" : "#18181b",
                color: "#f4f4f5",
                cursor: "pointer",
                fontWeight: isSelected ? "bold" : "normal",
              }}
            >
              {post.title}
            </button>
          );
        })}
      </div>

      {selectedPostId && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "10px",
            border: "2px solid #22c55e",
            backgroundColor: "#18181b",
          }}
        >
          {detailLoading && <p>Loading post and comments...</p>}
          {detailError && <p>Error: {detailError}</p>}

          {!detailLoading && postDetail && (
            <article>
              <h3 style={{ marginTop: 0 }}>{postDetail.title}</h3>
              <p>{postDetail.body}</p>

              <h4>Comments ({comments.length})</h4>
              <div style={{ display: "grid", gap: "10px" }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #f59e0b",
                      backgroundColor: "#09090b",
                    }}
                  >
                    <strong>{comment.name}:</strong> {comment.body}
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  );
}