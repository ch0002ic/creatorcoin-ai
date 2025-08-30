// Testing different touch event patterns for iOS simulator
// @ts-nocheck

function AppTouchTest() {
  console.log("🔍 Touch Event Test - Multiple Patterns");

  // Pattern 1: Standard catchtap
  const handleStandardTap = () => {
    console.log("✅ STANDARD CATCHTAP: Button tapped!");
  };

  // Pattern 2: ontap handler
  const handleOntap = () => {
    console.log("✅ ONTAP: Button tapped!");
  };

  // Pattern 3: onClick handler
  const handleOnClick = () => {
    console.log("✅ ONCLICK: Button tapped!");
  };

  return (
    <scroll-view style={{
      flex: 1,
      backgroundColor: '#f5f7fa'
    }}>
      <view style={{
        padding: 20,
        alignItems: 'center'
      }}>
        
        <text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 30,
          color: '#000'
        }}>Touch Event Tests</text>

        {/* Pattern 1: catchtap */}
        <view 
          catchtap={handleStandardTap}
          style={{
            backgroundColor: '#FF6B35',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            width: 280,
            alignItems: 'center'
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Pattern 1: catchtap
          </text>
        </view>

        {/* Pattern 2: ontap */}
        <view 
          ontap={handleOntap}
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            width: 280,
            alignItems: 'center'
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Pattern 2: ontap
          </text>
        </view>

        {/* Pattern 3: onClick */}
        <view 
          onClick={handleOnClick}
          style={{
            backgroundColor: '#34C759',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            width: 280,
            alignItems: 'center'
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Pattern 3: onClick
          </text>
        </view>

        {/* Pattern 4: Inline catchtap */}
        <view 
          catchtap={() => console.log("✅ INLINE CATCHTAP: Button tapped!")}
          style={{
            backgroundColor: '#FF3B30',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            width: 280,
            alignItems: 'center'
          }}
        >
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Pattern 4: Inline catchtap
          </text>
        </view>

        {/* Text element with catchtap */}
        <text 
          catchtap={() => console.log("✅ TEXT CATCHTAP: Text tapped!")}
          style={{
            backgroundColor: '#AF52DE',
            color: '#fff',
            padding: 15,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            width: 280,
            marginBottom: 30
          }}
        >
          Pattern 5: Text catchtap
        </text>

        <text style={{
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          marginBottom: 20
        }}>
          Try tapping each button and check console logs
        </text>

        <text style={{
          fontSize: 12,
          color: '#999',
          textAlign: 'center'
        }}>
          This screen should also be scrollable
        </text>

      </view>
    </scroll-view>
  );
}

export default AppTouchTest;
