// Vercel Serverless Function for Purchase API
export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    try {
      const { contentId, amount, creatorId } = req.body;
      
      // Demo mode authentication check
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const token = authHeader.substring(7);
      if (token !== 'demo-token') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Simulate successful purchase
      const transactionId = 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      res.status(200).json({
        message: 'Purchase processed successfully',
        transactionId,
        contentId,
        amount,
        creatorId,
        timestamp: new Date().toISOString(),
        blockchain: 'solana-devnet',
        status: 'confirmed'
      });
    } catch (error) {
      console.error('Purchase API error:', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
