import React, { useState } from 'react';
import { LynxView, LynxText, LynxButton, LynxCard, LynxInput, LynxList } from '../lynx/components';
import { Lynx, LynxGesture } from '../lynx/core';

interface ContentItem {
  id: string;
  title: string;
  creator: string;
  price: number;
  qualityScore: number;
  views: number;
  thumbnail: string;
}

const LynxDemo: React.FC = () => {
  const [platform] = useState(Lynx.detectPlatform());
  const [searchQuery, setSearchQuery] = useState('');
  const [mockContent] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'AI Art Generation Masterclass',
      creator: '@artcreator',
      price: 4.99,
      qualityScore: 94,
      views: 12500,
      thumbnail: '🎨'
    },
    {
      id: '2',
      title: 'Blockchain Development Tutorial',
      creator: '@blockchaindev',
      price: 7.99,
      qualityScore: 89,
      views: 8230,
      thumbnail: '⛓️'
    },
    {
      id: '3',
      title: 'React Native Cross-Platform Guide',
      creator: '@mobileDev',
      price: 6.50,
      qualityScore: 92,
      views: 15600,
      thumbnail: '📱'
    }
  ]);

  const handleGesture = (gesture: LynxGesture) => {
    console.log('Lynx Gesture detected:', gesture);
  };

  const handleContentPress = (content: ContentItem) => {
    console.log('Content selected:', content.title);
  };

  const handlePurchase = async (content: ContentItem) => {
    // Simulate blockchain payment
    console.log(`🔥 BUTTON CLICKED! Initiating blockchain payment for ${content.title} - $${content.price}`);
    
    // For demo purposes, just simulate a successful purchase without API call
    const transactionId = 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`🎉 Payment successful! 
    
Content: ${content.title}
Amount: $${content.price}
Transaction ID: ${transactionId}
Blockchain: Solana Devnet
Status: Confirmed

Thank you for your purchase!`);
  };

  // Filter content based on search query
  const filteredContent = mockContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContentItem = (item: ContentItem) => (
    <LynxCard 
      key={item.id}
      interactive 
      onPress={() => handleContentPress(item)}
      style={{ marginBottom: 12 }}
    >
      <LynxView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <LynxText style={{ fontSize: 32, marginRight: 16 }}>
          {item.thumbnail}
        </LynxText>
        
        <LynxView style={{ flex: 1 }}>
          <LynxText variant="h3" style={{ marginBottom: 4 }}>
            {item.title}
          </LynxText>
          
          <LynxText variant="caption" style={{ color: '#657786', marginBottom: 8 }}>
            By {item.creator} • {item.views.toLocaleString()} views
          </LynxText>
          
          <LynxView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <LynxView style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LynxText variant="body" weight="600" style={{ color: '#1DA1F2', marginRight: 12 }}>
                ${item.price}
              </LynxText>
              
              <LynxView style={{ 
                backgroundColor: item.qualityScore >= 90 ? '#1d9bf0' : '#657786',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4
              }}>
                <LynxText variant="caption" style={{ color: '#ffffff' }}>
                  AI Score: {item.qualityScore}
                </LynxText>
              </LynxView>
            </LynxView>
            
            <LynxButton 
              variant="primary" 
              size="small"
              onPress={() => handlePurchase(item)}
            >
              Buy Now
            </LynxButton>
          </LynxView>
        </LynxView>
      </LynxView>
    </LynxCard>
  );

  return (
    <LynxView 
      style={{ 
        padding: 20,
        backgroundColor: '#f7f9fa',
        minHeight: '100vh'
      }}
      onGesture={handleGesture}
      id="lynx-demo"
    >
      {/* Header */}
      <LynxView style={{ marginBottom: 24 }}>
        <LynxText variant="h1" style={{ 
          textAlign: 'center',
          marginBottom: 8,
          background: 'linear-gradient(135deg, #1DA1F2, #14171A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 CreatorCoin AI
        </LynxText>
        
        <LynxText variant="body" style={{ 
          textAlign: 'center',
          color: '#657786',
          marginBottom: 16
        }}>
          Lynx-Powered Cross-Platform Experience • Running on {platform}
        </LynxText>
        
        {/* Platform Indicator */}
        <LynxView style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20
        }}>
          <LynxView style={{
            backgroundColor: platform === 'web' ? '#1DA1F2' : 
                           platform === 'ios' ? '#007AFF' : '#4CAF50',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8
          }}>
            <LynxText variant="caption" style={{ color: '#ffffff' }}>
              {platform === 'web' ? '🌐 Web Platform' : 
               platform === 'ios' ? '📱 iOS Platform' : 
               '🤖 Android Platform'}
            </LynxText>
          </LynxView>
        </LynxView>
      </LynxView>

      {/* Service Status */}
      <LynxCard style={{ marginBottom: 20 }}>
        <LynxText variant="h3" style={{ marginBottom: 12 }}>
          🔗 Service Status
        </LynxText>
        
        <LynxView style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <LynxView style={{ alignItems: 'center' }}>
            <LynxText style={{ fontSize: 20, marginBottom: 4 }}>🟢</LynxText>
            <LynxText variant="caption">Backend API</LynxText>
            <LynxText variant="caption" style={{ color: '#657786' }}>:3001</LynxText>
          </LynxView>
          
          <LynxView style={{ alignItems: 'center' }}>
            <LynxText style={{ fontSize: 20, marginBottom: 4 }}>🟢</LynxText>
            <LynxText variant="caption">AI Service</LynxText>
            <LynxText variant="caption" style={{ color: '#657786' }}>:5000</LynxText>
          </LynxView>
          
          <LynxView style={{ alignItems: 'center' }}>
            <LynxText style={{ fontSize: 20, marginBottom: 4 }}>🟢</LynxText>
            <LynxText variant="caption">Frontend</LynxText>
            <LynxText variant="caption" style={{ color: '#657786' }}>:3000</LynxText>
          </LynxView>
        </LynxView>
      </LynxCard>

      {/* Search */}
      <LynxCard style={{ marginBottom: 20 }}>
        <LynxText variant="h3" style={{ marginBottom: 12 }}>
          🔍 Discover Content
        </LynxText>
        
        <LynxInput
          placeholder="Search AI-powered content..."
          value={searchQuery}
          onChange={setSearchQuery}
          style={{ marginBottom: 16 }}
        />
        
        <LynxView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['AI Art', 'Blockchain', 'Tutorial', 'Creative'].map(tag => (
            <LynxView 
              key={tag}
              style={{
                backgroundColor: searchQuery.toLowerCase().includes(tag.toLowerCase()) ? '#1DA1F2' : '#e1e8ed',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                cursor: 'pointer'
              }}
              onPress={() => {
                if (searchQuery.toLowerCase().includes(tag.toLowerCase())) {
                  setSearchQuery('');
                } else {
                  setSearchQuery(tag);
                }
              }}
            >
              <LynxText 
                variant="caption" 
                style={{ 
                  color: searchQuery.toLowerCase().includes(tag.toLowerCase()) ? '#ffffff' : '#14171a' 
                }}
              >
                {tag}
              </LynxText>
            </LynxView>
          ))}
        </LynxView>
      </LynxCard>

      {/* Content List */}
      <LynxCard>
        <LynxText variant="h3" style={{ marginBottom: 16 }}>
          🎯 Featured Content
        </LynxText>
        
        <LynxList
          data={filteredContent}
          renderItem={renderContentItem}
          keyExtractor={(item) => item.id}
        />
      </LynxCard>

      {/* Lynx Features Demo */}
      <LynxCard style={{ marginTop: 20 }}>
        <LynxText variant="h3" style={{ marginBottom: 12 }}>
          ⚡ Lynx Cross-Platform Features
        </LynxText>
        
        <LynxView style={{ gap: 12 }}>
          <LynxView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LynxText style={{ marginRight: 12 }}>🎨</LynxText>
            <LynxText>Platform-adaptive UI components</LynxText>
          </LynxView>
          
          <LynxView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LynxText style={{ marginRight: 12 }}>👆</LynxText>
            <LynxText>Cross-platform gesture handling</LynxText>
          </LynxView>
          
          <LynxView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LynxText style={{ marginRight: 12 }}>📱</LynxText>
            <LynxText>Responsive design system</LynxText>
          </LynxView>
          
          <LynxView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LynxText style={{ marginRight: 12 }}>🚀</LynxText>
            <LynxText>Native performance optimization</LynxText>
          </LynxView>
        </LynxView>
      </LynxCard>
      
      {/* Footer */}
      <LynxView style={{ 
        marginTop: 32,
        alignItems: 'center',
        paddingVertical: 20
      }}>
        <LynxText variant="caption" style={{ color: '#657786' }}>
          CreatorCoin AI • TikTok TechJam 2025 • Powered by Lynx
        </LynxText>
      </LynxView>
    </LynxView>
  );
};

export default LynxDemo;
