// Vercel Serverless Function for Blockchain Network Status
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    res.status(200).json({
      network: 'solana-devnet',
      status: 'connected',
      blockHeight: Math.floor(Math.random() * 1000000) + 200000000,
      tps: Math.floor(Math.random() * 3000) + 1500,
      validators: 1200 + Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString(),
      isDemo: true
    });
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
