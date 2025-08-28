// Vercel Serverless Function for Blockchain Network Status
export default function handler(req, res) {
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
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
