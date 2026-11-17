
"use client";

import { useEffect, useState } from "react";

const initialPosts = [];

const demoCaptions = [
  {
    text: "Big ideas start with small steps! 🚀 Turn your dreams into action and make every moment count.",
    hashtags: "#Motivation #Success #Growth #DreamBig",
  },
  {
    text: "Your next chapter starts today. Keep creating, keep growing, and never stop believing in yourself! ✨",
    hashtags: "#Inspiration #Mindset #DailyMotivation #Success",
  },
  {
    text: "Create something meaningful. Share your journey. Inspire the world. Your story deserves to be heard! 💜",
    hashtags: "#CreatorLife #ContentCreation #Inspire #SocialMedia",
  },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Engaging");
  const [captions, setCaptions] = useState([]);
  const [selected, setSelected] = useState(0);
  const [postText, setPostText] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [driveConnected, setDriveConnected] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("postpilot-posts") || "[]");
      setPosts(saved);
      setNotificationEmail(localStorage.getItem("postpilot-email") || "");
      setNotifications(localStorage.getItem("postpilot-notifications") !== "false");
    } catch {
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("postpilot-posts", JSON.stringify(posts));
  }, [posts]);

  async function generateCaptions() {
    if (!prompt.trim()) {
      setMessage("Please describe what your post is about.");
      return;
    }

    setLoading(true);
    setMessage("");
    setCaptions([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform, tone }),
      });

      if (!response.ok) throw new Error("API unavailable");

      const data = await response.json();
      const results = data.captions || [];
      if (!results.length) throw new Error("No captions returned");

      setCaptions(results);
      setSelected(0);
      setPostText(results[0].text + "\n\n" + results[0].hashtags);
    } catch {
      setCaptions(demoCaptions);
      setSelected(0);
      setPostText(demoCaptions[0].text + "\n\n" + demoCaptions[0].hashtags);
      setMessage("Demo mode: Connect Gemini API to generate live AI captions.");
    } finally {
      setLoading(false);
    }
  }

  function chooseCaption(index) {
    setSelected(index);
    setPostText(captions[index].text + "\n\n" + captions[index].hashtags);
  }

  function savePost() {
    if (!postText.trim()) {
      setMessage("Please generate or write a caption first.");
      return;
    }

    if (!scheduledAt) {
      setMessage("Please select a scheduled date and time.");
      return;
    }

    const post = {
      id: editingId || Date.now().toString(),
      text: postText,
      platform,
      scheduledAt,
      status: new Date(scheduledAt) > new Date() ? "Scheduled" : "Draft",
      email: notificationEmail,
      notifications,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      setPosts((old) => old.map((p) => p.id === editingId ? post : p));
      setEditingId(null);
      setMessage("Post updated successfully!");
    } else {
      setPosts((old) => [post, ...old]);
      setMessage("Post saved successfully!");
    }

    setPostText("");
    setScheduledAt("");
  }

  function editPost(post) {
    setEditingId(post.id);
    setPostText(post.text);
    setPlatform(post.platform);
    setScheduledAt(post.scheduledAt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setPosts((old) => old.filter((p) => p.id !== id));
    setMessage("Post deleted.");
  }

  const filteredPosts = posts.filter((p) => filter === "All" || p.status === filter);
  const scheduledCount = posts.filter((p) => p.status === "Scheduled").length;
  const draftCount = posts.filter((p) => p.status === "Draft").length;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>PostPilot<span className="brand-ai"> AI</span></span>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="navigation">
          <a className="nav-link active" href="#dashboard">▦ <span>Dashboard</span></a>
          <a className="nav-link" href="#generator">✧ <span>AI Generator</span></a>
          <a className="nav-link" href="#posts">▤ <span>My Posts</span></a>
          <a className="nav-link" href="#settings">⚙ <span>Settings</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <h3>Create without limits</h3>
            <p>Your content journey starts here.</p>
          </div>
          <div className="profile">
            <div className="avatar">P</div>
            <div><strong>Creator Workspace</strong><small>Free Plan</small></div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="top-actions">
            <span className="online-dot"></span>
            <span className="connected-text">Workspace active</span>
            <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>⚙</button>
          </div>
        </header>

        <div className="content" id="dashboard">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR CREATIVE WORKSPACE</div>
              <h1>Good ideas deserve <span>great content.</span></h1>
              <p className="subtitle">Create, organize, and schedule your social media content with AI.</p>
            </div>
            <div className="date-pill">✦ &nbsp; POSTPILOT AI</div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top"><span>Total Posts</span><span className="stat-icon purple">▤</span></div>
              <div className="stat-number">{posts.length}</div>
              <div className="stat-caption">Your saved content</div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><span>Scheduled</span><span className="stat-icon blue">◷</span></div>
              <div className="stat-number">{scheduledCount}</div>
              <div className="stat-caption">Ready for publishing</div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><span>Drafts</span><span className="stat-icon orange">✎</span></div>
              <div className="stat-number">{draftCount}</div>
              <div className="stat-caption">Content in progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><span>AI Captions</span><span className="stat-icon green">✧</span></div>
              <div className="stat-number">{captions.length}</div>
              <div className="stat-caption">Generated this session</div>
            </div>
          </div>

          <div className="section-heading" id="generator">
            <div><div className="eyebrow">POWERED BY GEMINI AI</div><h2>AI Content Studio <span className="sparkle">✦</span></h2></div>
            <span className="live-badge"><span></span> CREATIVE MODE</span>
          </div>

          <div className="studio-grid">
            <div className="panel generator-panel">
              <div className="panel-heading">
                <div><div className="panel-icon">✧</div><div><h3>Create your content</h3><p>Tell AI what you want to share.</p></div></div>
              </div>

              <label className="field-label">WHAT IS YOUR POST ABOUT?</label>
              <textarea className="prompt-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. Launching our new coffee brand. Highlight its unique flavor and encourage people to try it..." />

              <div className="form-row">
                <div><label className="field-label">PLATFORM</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="select-input">
                    <option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>X (Twitter)</option><option>TikTok</option>
                  </select>
                </div>
                <div><label className="field-label">TONE OF VOICE</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="select-input">
                    <option>Engaging</option><option>Professional</option><option>Funny</option><option>Inspirational</option><option>Casual</option>
                  </select>
                </div>
              </div>

              <button className="generate-button" onClick={generateCaptions} disabled={loading}>
                {loading ? "✧ Generating..." : "✧  Generate AI Captions"} <span>→</span>
              </button>
              <p className="helper-text">✦ &nbsp; Generates 3 unique captions with relevant hashtags.</p>
            </div>

            <div className="panel results-panel">
              <div className="results-header"><div><h3>Generated captions</h3><p>Choose your favorite version.</p></div><span className="count-badge">{captions.length} OPTIONS</span></div>
              {captions.length === 0 ? (
                <div className="empty-captions">
                  <div className="empty-sparkle">✧</div>
                  <h3>Your next great post starts here</h3>
                  <p>Enter a topic and let AI turn your ideas into engaging social content.</p>
                  <span>✦ &nbsp; AI POWERED CONTENT</span>
                </div>
              ) : (
                <div className="caption-list">
                  {captions.map((caption, i) => (
                    <button key={i} className={`caption-option ${selected === i ? "selected" : ""}`} onClick={() => chooseCaption(i)}>
                      <div className="caption-top"><strong>VERSION 0{i + 1}</strong><span>{selected === i ? "✓ SELECTED" : "SELECT"}</span></div>
                      <p>{caption.text}</p>
                      <div className="hashtags">{caption.hashtags}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="section-heading schedule-heading">
            <div><div className="eyebrow">PLAN YOUR CONTENT</div><h2>Post composer <span className="sparkle">✎</span></h2></div>
          </div>

          <div className="panel composer-panel">
            <div className="composer-top"><div><h3>{editingId ? "Edit your post" : "Customize your post"}</h3><p>Make it yours before saving.</p></div><span className="draft-tag">✎ POST EDITOR</span></div>
            <label className="field-label">POST CAPTION</label>
            <textarea className="composer-input" value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Your selected caption will appear here. You can edit it..." />
            <div className="composer-bottom">
              <div className="schedule-field"><label className="field-label">SCHEDULE DATE & TIME</label><input type="datetime-local" className="select-input date-input" value={scheduledAt} min={new Date().toISOString().slice(0, 16)} onChange={(e) => setScheduledAt(e.target.value)} /></div>
              <button className="save-button" onClick={savePost}>{editingId ? "✓ Update Post" : "＋ Save Post"} <span>→</span></button>
              {editingId && <button className="cancel-button" onClick={() => {setEditingId(null);setPostText("");}}>Cancel</button>}
            </div>
          </div>

          <div className="section-heading posts-heading" id="posts">
            <div><div className="eyebrow">YOUR CONTENT LIBRARY</div><h2>Recent posts <span className="sparkle">▤</span></h2></div>
            <span className="count-badge">{posts.length} TOTAL</span>
          </div>

          <div className="panel posts-panel">
            <div className="filter-row">
              {["All", "Scheduled", "Draft"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`filter-button ${filter === item ? "filter-active" : ""}`}>{item}</button>)}
            </div>
            {filteredPosts.length === 0 ? (
              <div className="empty-posts"><div>▤</div><h3>No posts yet</h3><p>Your saved and scheduled posts will appear here.</p></div>
            ) : (
              <div className="post-list">
                {filteredPosts.map((post) => (
                  <div className="post-item" key={post.id}>
                    <div className="post-platform-icon">{post.platform === "Instagram" ? "◎" : post.platform === "LinkedIn" ? "in" : "✦"}</div>
                    <div className="post-info"><strong>{post.platform}</strong><p>{post.text}</p><small>◷ &nbsp; {new Date(post.scheduledAt).toLocaleString()}</small></div>
                    <span className={`status-pill ${post.status === "Scheduled" ? "status-scheduled" : "status-draft"}`}>{post.status}</span>
                    <div className="post-actions"><button onClick={() => editPost(post)}>Edit</button><button onClick={() => deletePost(post.id)}>Delete</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section-heading settings-heading" id="settings"><div><div className="eyebrow">PERSONALIZE YOUR EXPERIENCE</div><h2>Integrations & settings <span className="sparkle">⚙</span></h2></div></div>

          {showSettings && (
            <div className="panel settings-panel">
              <h3>Notification preferences</h3>
              <p>Configure your email for scheduled post reminders.</p>
              <label className="field-label">NOTIFICATION EMAIL</label>
              <input className="select-input email-input" type="email" placeholder="you@example.com" value={notificationEmail} onChange={(e) => {setNotificationEmail(e.target.value);localStorage.setItem("postpilot-email",e.target.value);}} />
              <label className="toggle-row"><input type="checkbox" checked={notifications} onChange={(e) => {setNotifications(e.target.checked);localStorage.setItem("postpilot-notifications",String(e.target.checked));}} /> Enable scheduled post email notifications</label>
              <p className="helper-text">Email delivery will be activated after connecting the email service.</p>
            </div>
          )}

          <div className="integration-grid">
            <div className="panel integration-card"><div className="integration-icon drive-icon">▲</div><div><h3>Google Drive</h3><p>{driveConnected ? "Connected" : "Connect to sync your posts and drafts."}</p></div><button onClick={() => setMessage("Google Drive integration will be connected in the next setup step.")}>{driveConnected ? "Connected" : "Connect →"}</button></div>
            <div className="panel integration-card"><div className="integration-icon mail-icon">✉</div><div><h3>Email Notifications</h3><p>Send scheduled post reminders.</p></div><button onClick={() => setShowSettings(true)}>Configure →</button></div>
          </div>

          {message && <div className="toast" role="status">{message}<button onClick={() => setMessage("")}>×</button></div>}

          <footer>© 2026 PostPilot AI <span>Crafted for creators, powered by AI ✦</span></footer>
        </div>
      </section>
    </main>
  );
}
