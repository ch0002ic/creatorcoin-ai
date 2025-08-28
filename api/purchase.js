export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('Purchase API called with method:', req.method);
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    console.log('Processing POST request');
    
    // Simple success response for now
    const transactionId = 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return res.status(200).json({
      message: 'Purchase processed successfully',
      transactionId,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    });
  }
  
  // For any other method
  res.setHeader('Allow', ['POST', 'OPTIONS']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
