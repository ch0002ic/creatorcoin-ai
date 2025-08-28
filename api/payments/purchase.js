// Vercel Serverless Function for Purchase API
module.exports = (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('Purchase API called with method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    try {
      const { contentId, amount, creatorId } = req.body;
      
      console.log('Processing purchase:', { contentId, amount, creatorId });
      
      // Demo mode authentication check
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Missing or invalid auth header');
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const token = authHeader.substring(7);
      if (token !== 'demo-token') {
        console.log('Invalid token:', token);
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Simulate successful purchase
      const transactionId = 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const result = {
        message: 'Purchase processed successfully',
        transactionId,
        contentId,
        amount,
        creatorId,
        timestamp: new Date().toISOString(),
        blockchain: 'solana-devnet',
        status: 'confirmed'
      };
      
      console.log('Sending success response:', result);
      res.status(200).json(result);
    } catch (error) {
      console.error('Purchase API error:', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  } else {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
