import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="section">
      <div className="section-header" style={{ marginBottom: "18px" }}>
        <div>
          <h2>Settings</h2>
          <p>Manage your account settings and preferences.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        {/* Settings Sidebar */}
        <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "10px 14px",
              textAlign: "left",
              background: activeTab === "profile" ? "var(--bg-soft)" : "transparent",
              color: activeTab === "profile" ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: activeTab === "profile" ? "600" : "500",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            style={{
              padding: "10px 14px",
              textAlign: "left",
              background: activeTab === "preferences" ? "var(--bg-soft)" : "transparent",
              color: activeTab === "preferences" ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: activeTab === "preferences" ? "600" : "500",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Preferences
          </button>
        </div>

        {/* Settings Content */}
        <div className="panel" style={{ flex: 1, minHeight: "400px" }}>
          {activeTab === "profile" && (
            <div>
              <div className="panel-header" style={{ marginBottom: "20px" }}>
                <h3>Profile Information</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>Full Name</label>
                  <input
                    type="text"
                    defaultValue={userName}
                    style={{
                      height: "36px",
                      padding: "0 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-soft)",
                      fontSize: "12px",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>Work Email</label>
                  <input
                    type="email"
                    defaultValue={userEmail}
                    style={{
                      height: "36px",
                      padding: "0 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-soft)",
                      fontSize: "12px",
                      outline: "none"
                    }}
                  />
                </div>

                {/* <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>Company Role</label>
                  <input
                    type="text"
                    defaultValue="Marketing Manager"
                    style={{
                      height: "36px",
                      padding: "0 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-soft)",
                      fontSize: "12px",
                      outline: "none"
                    }}
                  />
                </div> */}

                <div style={{ marginTop: "12px", paddingTop: "16px", borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Logout
                  </button>

                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "#0d5bd7",
                      color: "white",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <div className="panel-header" style={{ marginBottom: "20px" }}>
                <h3>Application Preferences</h3>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No preferences available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
