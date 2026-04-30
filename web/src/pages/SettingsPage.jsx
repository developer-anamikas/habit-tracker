import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offPeriod, setOffPeriod] = useState(null);
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");

  const [user, setUser] = useState({
    name: "User Name",
    email: "user@example.com"
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = {
        name: "User_Name",
        email: "email_address"
      };
      setUser(loggedInUser);
    };
    fetchUserData();
  }, []);

  const handleSaveOffMode = () => {
    if (tempStart && tempEnd) {
      setOffPeriod({ start: tempStart, end: tempEnd });
      setIsModalOpen(false);
    } else {
      alert("Please select both dates!");
    }
  };

  const cardBg = isDarkMode ? '#1a1a2e' : 'white';
  const cardBorder = isDarkMode ? '#2d2d4e' : '#e5e7eb';
  const headingColor = isDarkMode ? '#e2e8f0' : '#1f2937';
  const subheadingColor = isDarkMode ? '#cbd5e1' : '#374151';
  const textColor = isDarkMode ? '#94a3b8' : '#4b5563';
  const dividerColor = isDarkMode ? '#2d2d4e' : '#f3f4f6';

  return (
    <div style={{ maxWidth: '800px', fontFamily: 'sans-serif', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: headingColor }}>Settings</h1>

      {/* SECTION 1: USER PROFILE */}
      <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}`, marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: subheadingColor }}>User Profile</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: isDarkMode ? '#2d2d4e' : '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDarkMode ? '#a78bfa' : '#7e22ce', fontSize: '24px', fontWeight: 'bold' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: '600', color: headingColor, margin: 0 }}>{user.name}</p>
            <p style={{ fontSize: '14px', color: textColor, margin: 0 }}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: APP PREFERENCES */}
      <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}`, marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: subheadingColor }}>App Preferences</h2>

        {/* Dark Mode Toggle Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${dividerColor}` }}>
          <div>
            <span style={{ color: textColor, fontWeight: '500' }}>Dark Mode</span>
            <p style={{ fontSize: '12px', color: isDarkMode ? '#64748b' : '#9ca3af', margin: '2px 0 0 0' }}>Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isDarkMode ? '#6d28d9' : '#e5e7eb',
              color: isDarkMode ? 'white' : '#374151',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            <span>{isDarkMode ? '🌙' : '☀️'}</span>
            <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>

        {/* Email Notifications Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
          <span style={{ color: textColor }}>Email Notifications</span>
          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Enabled</span>
        </div>
      </div>

      {/* SECTION 3: MOOD & FOCUS */}
      <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${cardBorder}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: subheadingColor }}>Mood & Focus</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: '600', color: headingColor, margin: '0 0 4px 0' }}>🌴 Off Mode</p>
            {offPeriod ? (
              <p style={{ fontSize: '13px', color: '#4f46e5', fontWeight: 'bold', margin: 0 }}>
                Active: {offPeriod.start} to {offPeriod.end}
              </p>
            ) : (
              <p style={{ fontSize: '13px', color: textColor, margin: 0 }}>Pause streaks and hide habits while you rest.</p>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '8px 16px', backgroundColor: isDarkMode ? '#2d2d4e' : '#f3f4f6', border: `1px solid ${cardBorder}`, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: isDarkMode ? '#e2e8f0' : '#374151' }}
          >
            {offPeriod ? "Edit Days" : "Set Off Days"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#1f1f1f', color: 'white', padding: '24px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', border: `1px solid ${cardBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#e2e8f0' }}>🌴 Set Vacation Timeline</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>START DATE</label>
                <input type="date" onChange={(e) => setTempStart(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#2d2d4e', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>END DATE</label>
                <input type="date" onChange={(e) => setTempEnd(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#2d2d4e', color: 'white', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#374151', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveOffMode} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Save Timeline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;