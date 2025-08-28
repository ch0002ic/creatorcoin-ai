import { useState } from 'react'
import './App.css'
import LynxDemo from './components/LynxDemo'

function App() {
  const [showLynxDemo, setShowLynxDemo] = useState(false)

  if (showLynxDemo) {
    return <LynxDemo />
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 CreatorCoin AI</h1>
        <p>Revolutionary Creator Monetization Platform</p>
        <p>TikTok TechJam 2025</p>
        <div style={{ marginTop: '2rem' }}>
          <h2>🎯 Core Features</h2>
          <ul style={{ textAlign: 'left', maxWidth: '600px' }}>
            <li>🤖 AI-Powered Content Quality Assessment</li>
            <li>💰 Transparent Blockchain Payments</li>
            <li>📊 Real-time Creator Analytics</li>
            <li>🌐 Cross-platform Lynx UI</li>
            <li>🔒 Fraud Prevention & AML Compliance</li>
          </ul>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => alert('Backend API: http://localhost:3001\nAI Service: http://localhost:5000')}>
            Check Services
          </button>
          <button 
            onClick={() => setShowLynxDemo(true)}
            style={{
              background: 'linear-gradient(135deg, #1DA1F2, #14171A)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            🚀 Launch Lynx Demo
          </button>
        </div>
      </header>
    </div>
  )
}

export default App
