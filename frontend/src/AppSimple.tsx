import { useState, useEffect } from "@lynx-js/react";

function AppSimple() {
  const [currentDemo, setCurrentDemo] = useState<string>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [demoData, setDemoData] = useState<any>(null);
  const [serviceStatus, setServiceStatus] = useState<any>({
    backend: 'checking',
    ai: 'checking',
    frontend: 'online'
  });

  useEffect(() => {
    console.info("🚀 CreatorCoin AI - Simplified Lynx Demo");
    checkServiceStatus();
    
    // Set up periodic status checking (safe pattern)
    const statusInterval = setInterval(checkServiceStatus, 30000); // Every 30 seconds
    
    return () => clearInterval(statusInterval);
  }, []);

  const checkServiceStatus = async () => {
    const newStatus = { frontend: 'online', backend: 'offline', ai: 'offline' };
    
    try {
      const backendResponse = await fetch('http://localhost:3001/health');
      newStatus.backend = backendResponse.ok ? 'online' : 'offline';
    } catch (error) {
      newStatus.backend = 'offline';
    }
    
    try {
      const aiResponse = await fetch('http://localhost:5000/health');
      newStatus.ai = aiResponse.ok ? 'online' : 'offline';
    } catch (error) {
      newStatus.ai = 'offline';
    }
    
    setServiceStatus(newStatus);
  };

  const loadDemoData = async (demoId: string) => {
    setIsLoading(true);
    setCurrentDemo(demoId);
    
    try {
      if (demoId === 'content' && serviceStatus.ai === 'online') {
        // Try to call real AI service
        const aiResponse = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: {
              title: "CreatorCoin AI Demo",
              description: "TikTok TechJam 2025 submission showcasing AI-powered content analysis",
              duration: 60,
              tags: ["AI", "blockchain", "TikTok", "creator economy"]
            }
          })
        });
        
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          setDemoData({
            source: 'real-ai',
            qualityScore: Math.round(aiData.overall_quality_score || 87),
            breakdown: {
              engagement: Math.round(aiData.engagement_prediction?.engagement_rate * 1000 || 85),
              educational: Math.round(aiData.quality_metrics?.educational_value || 90),
              creativity: Math.round(aiData.quality_metrics?.creativity_score || 88),
              safety: Math.round(aiData.safety_analysis?.safety_score * 100 || 95),
              production: Math.round(aiData.quality_metrics?.production_quality || 82)
            }
          });
        }
      }
    } catch (error) {
      console.log('Using demo data');
    }
    
    setIsLoading(false);
  };

  const renderServiceStatus = () => {
    // Safe pattern: direct property access with fallbacks
    const frontendStatus = serviceStatus.frontend || 'offline';
    const backendStatus = serviceStatus.backend || 'offline';
    const aiStatus = serviceStatus.ai || 'offline';
    
    return (
      <view style={{ 
        background: '#f8f9fa', 
        border: '1px solid #e9ecef', 
        borderRadius: '6px', 
        padding: '1rem', 
        margin: '1rem 0' 
      }}>
        <text style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
          Service Status
        </text>
        <text style={{ display: 'block', color: frontendStatus === 'online' ? '#28a745' : '#dc3545' }}>
          🌐 Frontend: {frontendStatus}
        </text>
        <text style={{ display: 'block', color: backendStatus === 'online' ? '#28a745' : '#dc3545' }}>
          🖥️ Backend: {backendStatus}
        </text>
        <text style={{ display: 'block', color: aiStatus === 'online' ? '#28a745' : '#dc3545' }}>
          🤖 AI Service: {aiStatus}
        </text>
        
        {/* Safe pattern: Simple conditional rendering */}
        {backendStatus === 'online' && aiStatus === 'online' ? (
          <text style={{ display: 'block', marginTop: '0.5rem', color: '#28a745', fontSize: '0.9rem' }}>
            ✅ All systems ready for demo
          </text>
        ) : (
          <text style={{ display: 'block', marginTop: '0.5rem', color: '#ffc107', fontSize: '0.9rem' }}>
            ⚠️ Some services offline - using demo data
          </text>
        )}
        
        <view 
          style={{ 
            display: 'block', 
            marginTop: '0.8rem', 
            padding: '0.3rem 0.6rem',
            background: '#007bff',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'center',
            width: 'fit-content'
          }}
          onClick={checkServiceStatus}
        >
          <text style={{ 
            color: '#fff',
            fontSize: '0.8rem'
          }}>
            🔄 Refresh Status
          </text>
        </view>
      </view>
    );
  };

  const renderWelcome = () => (
    <view style={{ padding: '1rem' }}>
      <text style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
        CreatorCoin AI
      </text>
      <text style={{ fontSize: '1rem', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
        TikTok TechJam 2025 - Track 6: Value-Sharing Reimagined
      </text>
      <text style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem', display: 'block', textAlign: 'center' }}>
        AI-powered content analysis with blockchain transparency
      </text>
      
      {renderServiceStatus()}
      
      <view style={{ margin: '1rem 0' }}>
        <text style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
          Demo Features:
        </text>
        <text style={{ display: 'block', marginBottom: '0.3rem' }}>
          🤖 Real-time AI content analysis
        </text>
        <text style={{ display: 'block', marginBottom: '0.3rem' }}>
          ⛓️ Solana blockchain integration
        </text>
        <text style={{ display: 'block', marginBottom: '0.3rem' }}>
          📊 Creator analytics dashboard
        </text>
        <text style={{ display: 'block', marginBottom: '0.3rem' }}>
          🌐 Cross-platform Lynx UI
        </text>
      </view>
    </view>
  );

  const renderContentAnalysis = () => (
    <view style={{ padding: '1rem' }}>
      <text style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
        🤖 AI Content Analysis
      </text>
      
      {isLoading ? (
        <view style={{ padding: '2rem', textAlign: 'center' }}>
          <text style={{ fontSize: '1rem', color: '#666' }}>
            Loading AI analysis...
          </text>
        </view>
      ) : (
        <view style={{ 
          background: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '1rem' 
        }}>
          <text style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center', color: '#28a745' }}>
            Quality Score: {demoData?.qualityScore || 87}/100
          </text>
          
          <view style={{ marginBottom: '1rem' }}>
            <text style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Detailed Breakdown:
            </text>
            <text style={{ display: 'block', marginBottom: '0.3rem', padding: '0.2rem 0' }}>
              📈 Engagement Potential: {demoData?.breakdown?.engagement || 85}/100
            </text>
            <text style={{ display: 'block', marginBottom: '0.3rem', padding: '0.2rem 0' }}>
              🎓 Educational Value: {demoData?.breakdown?.educational || 90}/100
            </text>
            <text style={{ display: 'block', marginBottom: '0.3rem', padding: '0.2rem 0' }}>
              🎨 Creativity Score: {demoData?.breakdown?.creativity || 88}/100
            </text>
            <text style={{ display: 'block', marginBottom: '0.3rem', padding: '0.2rem 0' }}>
              🛡️ Safety Rating: {demoData?.breakdown?.safety || 95}/100
            </text>
            <text style={{ display: 'block', marginBottom: '0.3rem', padding: '0.2rem 0' }}>
              🎬 Production Quality: {demoData?.breakdown?.production || 82}/100
            </text>
          </view>
          
          <view>
            <text style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              AI Insights:
            </text>
            <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem' }}>
              • {demoData?.source === 'real-ai' ? 'Real AI analysis from backend' : 'Demo mode - connect services for live analysis'}
            </text>
            <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem' }}>
              • Multi-dimensional quality assessment
            </text>
            <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem' }}>
              • TikTok TechJam 2025 optimized
            </text>
          </view>
        </view>
      )}
    </view>
  );

  const renderBlockchain = () => (
    <view style={{ padding: '1rem' }}>
      <text style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
        ⛓️ Blockchain Wallet
      </text>
      
      <view style={{ 
        background: '#fff', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1rem' 
      }}>
        <text style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
          Portfolio Balance
        </text>
        <view style={{ marginBottom: '1rem' }}>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0', fontSize: '1rem' }}>
            💰 SOL: 2.45 ($89.32)
          </text>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0', fontSize: '1rem' }}>
            💵 USDC: $1,250.00
          </text>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0', fontSize: '1rem' }}>
            🪙 CCOIN: 15,000 tokens
          </text>
        </view>
        
        <view style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <text style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Recent Transactions:
          </text>
          <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem', color: '#28a745' }}>
            ✅ Content Purchase: $25.00 - Confirmed
          </text>
          <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem', color: '#28a745' }}>
            ✅ Creator Tip: $10.00 - Confirmed  
          </text>
          <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem', color: '#ffc107' }}>
            ⏳ Earnings Claim: $50.00 - Pending
          </text>
        </view>
      </view>
    </view>
  );

  const handleNavigation = (demoId: string) => {
    console.log('Navigation clicked:', demoId); // Debug log
    console.log('Current demo before:', currentDemo); // Debug log
    setCurrentDemo(demoId);
    console.log('Setting demo to:', demoId); // Debug log
    if (demoId === 'content') {
      loadDemoData('content');
    }
  };

  // Alternative event handler for better compatibility
  const handleButtonPress = (demoId: string) => {
    console.log('Button press detected:', demoId);
    handleNavigation(demoId);
  };

  const renderNavigation = () => (
    <view style={{ 
      padding: '1rem', 
      borderTop: '1px solid #ddd',
      background: '#f8f9fa'
    }}>
      <text style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', textAlign: 'center' }}>
        Navigation
      </text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
        <view 
          style={{ 
            padding: '0.5rem', 
            background: currentDemo === 'welcome' ? '#007bff' : '#e9ecef', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('welcome')}
          onPointerDown={() => handleButtonPress('welcome')}
        >
          <text style={{
            color: currentDemo === 'welcome' ? '#fff' : '#333',
            fontSize: '0.8rem'
          }}>
            Home
          </text>
        </view>
        <view 
          style={{ 
            padding: '0.5rem', 
            background: currentDemo === 'content' ? '#007bff' : '#e9ecef', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('content')}
          onPointerDown={() => handleButtonPress('content')}
        >
          <text style={{
            color: currentDemo === 'content' ? '#fff' : '#333',
            fontSize: '0.8rem'
          }}>
            AI
          </text>
        </view>
        <view 
          style={{ 
            padding: '0.5rem', 
            background: currentDemo === 'blockchain' ? '#007bff' : '#e9ecef', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('blockchain')}
          onPointerDown={() => handleButtonPress('blockchain')}
        >
          <text style={{
            color: currentDemo === 'blockchain' ? '#fff' : '#333',
            fontSize: '0.8rem'
          }}>
            Wallet
          </text>
        </view>
        <view 
          style={{ 
            padding: '0.5rem', 
            background: currentDemo === 'analytics' ? '#007bff' : '#e9ecef', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('analytics')}
          onPointerDown={() => handleButtonPress('analytics')}
        >
          <text style={{
            color: currentDemo === 'analytics' ? '#fff' : '#333',
            fontSize: '0.8rem'
          }}>
            Stats
          </text>
        </view>
      </view>
    </view>
  );

  const renderAnalytics = () => (
    <view style={{ padding: '1rem' }}>
      <text style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
        📊 Creator Analytics
      </text>
      
      <view style={{ 
        background: '#fff', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1rem' 
      }}>
        <text style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>
          Performance Dashboard
        </text>
        
        <view style={{ marginBottom: '1rem' }}>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0' }}>
            💰 Total Earnings: $2,847.50
          </text>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0' }}>
            👁️ Total Views: 125,430
          </text>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0' }}>
            📹 Content Published: 23 videos
          </text>
          <text style={{ display: 'block', marginBottom: '0.4rem', padding: '0.3rem 0' }}>
            ⭐ Average Rating: 4.7/5.0
          </text>
        </view>
        
        <view style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <text style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Growth Metrics:
          </text>
          <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem', color: '#28a745' }}>
            📈 Engagement Rate: +15% this month
          </text>
          <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem', color: '#28a745' }}>
            🚀 Subscriber Growth: +340 followers
          </text>
          <text style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.9rem', color: '#28a745' }}>
            💎 Quality Score Trend: Excellent
          </text>
        </view>
      </view>
    </view>
  );

  const renderCurrentView = () => {
    switch (currentDemo) {
      case 'content':
        return renderContentAnalysis();
      case 'blockchain':
        return renderBlockchain();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderWelcome();
    }
  };

  return (
    <view style={{ 
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {renderCurrentView()}
      {renderNavigation()}
    </view>
  );
}

export default AppSimple;
