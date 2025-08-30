// Testing different scrolling approaches for iOS simulator
// @ts-nocheck

function ScrollTest() {
  console.log("🔍 Scroll Test - Multiple Approaches");

  return (
    <view style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      
      <text style={{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#fff',
        color: '#000'
      }}>
        Scroll Test - Try Different Areas
      </text>

      {/* Test 1: Standard scroll-view */}
      <scroll-view style={{
        flex: 1,
        backgroundColor: '#e3f2fd'
      }}>
        <view style={{ padding: 20 }}>
          <text style={{ fontSize: 16, marginBottom: 15, color: '#000' }}>
            📜 SCROLL AREA 1: Standard scroll-view
          </text>
          
          {/* Generate enough content to require scrolling */}
          {Array.from({ length: 20 }, (_, i) => (
            <view key={i} style={{
              backgroundColor: i % 2 === 0 ? '#bbdefb' : '#e1f5fe',
              padding: 15,
              marginBottom: 10,
              borderRadius: 8
            }}>
              <text style={{ color: '#000', fontSize: 14 }}>
                Content Block {i + 1} - This is test content to check scrolling behavior. 
                Try swiping up and down to scroll through this content.
              </text>
            </view>
          ))}
          
          <text style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            textAlign: 'center',
            padding: 20,
            backgroundColor: '#4caf50',
            color: '#fff',
            borderRadius: 8
          }}>
            🎉 END OF SCROLL TEST - If you can see this, scrolling works!
          </text>
        </view>
      </scroll-view>

    </view>
  );
}

export default ScrollTest;
