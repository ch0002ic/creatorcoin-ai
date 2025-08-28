// Vercel Serverless Function for Purchase API
export default function handler(req, res) {
  if (req.method === 'POST') {
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
