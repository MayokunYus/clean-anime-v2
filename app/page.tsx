"use client";
import { useState } from "react";

interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: { jpg: { image_url: string } };
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  genres: { name: string }[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Anime | null>(null);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSelected(null);
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=9&sfw=true`,
    );
    const data = await res.json();
    setResults(data.data || []);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "48px", color: "#ff3d6b", margin: 0 }}>
          🎌 AniWorld
        </h1>
        <p style={{ color: "#888", marginTop: "8px" }}>Search any anime</p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search(query)}
          placeholder="e.g. Naruto, One Piece..."
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            fontSize: "16px",
            width: "300px",
          }}
        />
        <button
          onClick={() => search(query)}
          style={{
            padding: "12px 24px",
            background: "#ff3d6b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        {[
          "Naruto",
          "One Piece",
          "Death Note",
          "Demon Slayer",
          "Jujutsu Kaisen",
        ].map((t) => (
          <button
            key={t}
            onClick={() => {
              setQuery(t);
              search(t);
            }}
            style={{
              padding: "6px 14px",
              background: "#1a1a2e",
              border: "1px solid #333",
              color: "#aaa",
              borderRadius: "100px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "#888" }}>Searching...</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {results.map((anime) => (
          <div
            key={anime.mal_id}
            onClick={() => setSelected(anime)}
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
            />
            <div style={{ padding: "10px" }}>
              <p style={{ fontSize: "13px", fontWeight: "bold", margin: 0 }}>
                {anime.title_english || anime.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#ffb347",
                  margin: "4px 0 0",
                }}
              >
                {anime.score ? `★ ${anime.score}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: "16px",
              maxWidth: "560px",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex" }}>
              <img
                src={selected.images.jpg.image_url}
                alt={selected.title}
                style={{ width: "180px", objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{ padding: "20px" }}>
                <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
                  {selected.title_english || selected.title}
                </h2>
                <p style={{ color: "#ffb347", margin: "0 0 8px" }}>
                  {selected.score ? `★ ${selected.score}` : ""}{" "}
                  {selected.episodes ? `· ${selected.episodes} eps` : ""}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "12px",
                  }}
                >
                  {selected.genres.slice(0, 4).map((g) => (
                    <span
                      key={g.name}
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        background: "#1a1a3a",
                        border: "1px solid #333",
                        borderRadius: "100px",
                        color: "#7eb8f7",
                      }}
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
                <p
                  style={{ fontSize: "13px", color: "#999", lineHeight: "1.6" }}
                >
                  {selected.synopsis
                    ? selected.synopsis.slice(0, 300) + "..."
                    : "No synopsis available."}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    marginTop: "16px",
                    padding: "8px 20px",
                    background: "#ff3d6b",
                    border: "none",
                    color: "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
