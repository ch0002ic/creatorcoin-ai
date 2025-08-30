// Ultra minimal debug test using createElement pattern
// @ts-nocheck
import { createElement } from "@lynx-js/react";

function AppDebug() {
  console.log("🔍 Ultra Minimal Test - createElement Pattern");

  const handleTap = () => {
    console.log("✅ BUTTON TAPPED! Success!");
    console.log("🎯 Handler executed successfully");
  };

  // Ultra minimal structure using createElement
  return createElement('scroll-view', {
    style: {
      flex: 1,
      backgroundColor: '#f5f7fa'
    }
  }, 
    createElement('view', {
      style: {
        padding: 20,
        alignItems: 'center'
      }
    },
      // Title
      createElement('text', {
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: '#000'
        }
      }, 'Ultra Minimal Test'),
      
      // Test button using createElement
      createElement('view', {
        catchtap: handleTap,
        style: {
          backgroundColor: '#FF6B35',
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          width: 250,
          alignItems: 'center'
        }
      },
        createElement('text', {
          style: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold'
          }
        }, '🚀 TAP ME!')
      ),
      
      // Status text
      createElement('text', {
        style: {
          fontSize: 14,
          color: '#333',
          textAlign: 'center'
        }
      }, 'Check console for tap events')
    )
  );
}

export default AppDebug;
