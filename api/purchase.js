export default function handler(req, res) {
  return res.status(200).json({
    message: 'Purchase API is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
