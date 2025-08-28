export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Purchase API called with method:', req.method);
  
  // Generate a transaction ID
  const transactionId = 'TX_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  return res.status(200).json({
    message: 'Purchase processed successfully',
    method: req.method,
    transactionId,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  });
}
