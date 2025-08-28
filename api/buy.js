export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Buy API called with method:', req.method);
  
  if (req.method === 'POST') {
    // Extract purchase data
    const { contentId, amount, creatorId } = req.body || {};
    
    // Generate transaction ID
    const transactionId = 'TX_API_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Return successful purchase response
    return res.status(200).json({
      message: 'Purchase processed successfully',
      transactionId,
      contentId,
      amount,
      creatorId,
      status: 'confirmed',
      blockchain: 'solana-devnet',
      timestamp: new Date().toISOString(),
      source: 'backend-api'
    });
  }
  
  // For GET requests (browser visits)
  return res.status(200).json({
    message: 'Buy API is working!',
    method: req.method,
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: 'Submit purchase transaction',
      GET: 'API health check'
    }
  });
}
