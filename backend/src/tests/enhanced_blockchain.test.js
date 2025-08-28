/**
 * Enhanced Blockchain Integration Tests
 * Comprehensive testing for production-ready Solana integration
 */

const request = require('supertest');
const app = require('../src/index');
const enhancedBlockchain = require('../src/services/enhanced_blockchain');

describe('Enhanced Blockchain Integration', () => {
  let authToken;
  let testWalletAddress;

  beforeAll(async () => {
    // Setup test authentication
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });
    
    authToken = authResponse.body.token;
    testWalletAddress = 'DEMO_WALLET_' + Math.random().toString(36).substr(2, 9);
  });

  describe('Wallet Connection', () => {
    test('should connect wallet with enhanced service', async () => {
      const response = await request(app)
        .post('/api/blockchain/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletAddress: testWalletAddress,
          signature: 'enhanced_signature_' + Math.random().toString(36).substr(2, 50)
        });

      expect(response.status).toBe(200);
      expect(response.body.connected).toBe(true);
      expect(response.body.address).toBe(testWalletAddress);
      expect(response.body.balance).toBeDefined();
      expect(response.body.network).toBeDefined();
      expect(response.body.isReal).toBeDefined();
    });

    test('should get wallet information', async () => {
      const response = await request(app)
        .get('/api/blockchain/wallet')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.balance).toBeDefined();
      expect(response.body.network).toBeDefined();
    });

    test('should disconnect wallet', async () => {
      const response = await request(app)
        .post('/api/blockchain/disconnect')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.connected).toBe(false);
    });
  });

  describe('Payment Processing', () => {
    beforeEach(async () => {
      // Reconnect wallet for payment tests
      await request(app)
        .post('/api/blockchain/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletAddress: testWalletAddress,
          signature: 'payment_test_signature_' + Math.random().toString(36).substr(2, 50)
        });
    });

    test('should process enhanced payment transaction', async () => {
      const response = await request(app)
        .post('/api/blockchain/payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          contentId: 'test_content_123',
          amount: 5.50,
          creatorAddress: 'CREATOR_WALLET_' + Math.random().toString(36).substr(2, 9),
          currency: 'USDC'
        });

      expect(response.status).toBe(200);
      expect(response.body.transactionId).toBeDefined();
      expect(response.body.signature).toBeDefined();
      expect(response.body.status).toBe('completed');
      expect(response.body.blockHeight).toBeDefined();
      expect(response.body.confirmations).toBeDefined();
      expect(response.body.gasUsed).toBeDefined();
      expect(response.body.processingTime).toBeDefined();
      expect(response.body.isReal).toBeDefined();
    });

    test('should handle missing payment information', async () => {
      const response = await request(app)
        .post('/api/blockchain/payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          contentId: 'test_content_123'
          // Missing amount and creatorAddress
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required payment information');
    });
  });

  describe('Token Staking', () => {
    beforeEach(async () => {
      // Reconnect wallet for staking tests
      await request(app)
        .post('/api/blockchain/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletAddress: testWalletAddress,
          signature: 'staking_test_signature_' + Math.random().toString(36).substr(2, 50)
        });
    });

    test('should stake tokens successfully', async () => {
      const response = await request(app)
        .post('/api/blockchain/stake')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 1000,
          duration: 60 // 60 days
        });

      expect(response.status).toBe(200);
      expect(response.body.stakeId).toBeDefined();
      expect(response.body.amount).toBe(1000);
      expect(response.body.duration).toBe(60);
      expect(response.body.apy).toBeDefined();
      expect(response.body.projectedRewards).toBeDefined();
      expect(response.body.unlockDate).toBeDefined();
    });

    test('should get staking pool information', async () => {
      const response = await request(app)
        .get('/api/blockchain/staking');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stakingPool).toBeDefined();
      expect(response.body.stakingPool.totalStaked).toBeDefined();
      expect(response.body.stakingPool.apy).toBeDefined();
      expect(response.body.stakingPool.participants).toBeDefined();
    });
  });

  describe('Network Information', () => {
    test('should get network status', async () => {
      const response = await request(app)
        .get('/api/blockchain/network');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.network).toBeDefined();
      expect(response.body.isReal).toBeDefined();
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.currentSlot).toBeDefined();
      expect(response.body.stats.tps).toBeDefined();
    });

    test('should get transaction history', async () => {
      const response = await request(app)
        .get('/api/blockchain/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.transactions).toBeDefined();
      expect(Array.isArray(response.body.transactions)).toBe(true);
      expect(response.body.count).toBeDefined();
    });

    test('should get token information', async () => {
      const response = await request(app)
        .get('/api/blockchain/tokens/CCOIN');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.token.totalSupply).toBeDefined();
      expect(response.body.token.price).toBeDefined();
    });
  });

  describe('Transaction Verification', () => {
    test('should verify transaction signature', async () => {
      const response = await request(app)
        .post('/api/blockchain/verify')
        .send({
          signature: 'enhanced_verification_signature_' + Math.random().toString(36).substr(2, 50),
          expectedAmount: 10.0,
          expectedRecipient: 'RECIPIENT_WALLET_ADDRESS'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.valid).toBeDefined();
      expect(response.body.verificationMethod).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });

    test('should handle missing signature verification', async () => {
      const response = await request(app)
        .post('/api/blockchain/verify')
        .send({
          expectedAmount: 10.0
          // Missing signature
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Transaction signature required');
    });
  });

  describe('Enhanced Blockchain Service Direct Tests', () => {
    test('should initialize connection properly', () => {
      expect(enhancedBlockchain.connected).toBe(true);
      expect(enhancedBlockchain.network).toBeDefined();
    });

    test('should generate realistic transaction IDs', () => {
      const txId = enhancedBlockchain.generateTransactionId();
      expect(txId).toMatch(/^tx_\d+_[a-z0-9]+$/);
    });

    test('should calculate gas fees realistically', () => {
      const gasUsed = enhancedBlockchain.calculateGasUsed(100);
      expect(gasUsed).toBeGreaterThan(5000);
      expect(gasUsed).toBeLessThan(20000);
    });

    test('should handle mock data initialization', () => {
      expect(enhancedBlockchain.mockBlockchain.wallets.size).toBeGreaterThan(0);
      expect(enhancedBlockchain.mockBlockchain.tokens.has('CCOIN')).toBe(true);
      expect(enhancedBlockchain.mockBlockchain.stakingPools.has('main_pool')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle unauthorized requests', async () => {
      const response = await request(app)
        .post('/api/blockchain/payment')
        .send({
          contentId: 'test_content_123',
          amount: 5.50,
          creatorAddress: 'CREATOR_WALLET_ADDRESS'
        });

      expect(response.status).toBe(401);
    });

    test('should handle invalid wallet addresses gracefully', async () => {
      const response = await request(app)
        .post('/api/blockchain/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletAddress: '', // Invalid empty address
          signature: 'test_signature'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Wallet address required');
    });
  });

  describe('Performance Tests', () => {
    test('should handle concurrent payment requests', async () => {
      // Reconnect wallet
      await request(app)
        .post('/api/blockchain/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          walletAddress: testWalletAddress,
          signature: 'concurrent_test_signature'
        });

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .post('/api/blockchain/payment')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              contentId: `test_content_${i}`,
              amount: Math.random() * 10 + 1,
              creatorAddress: `CREATOR_${i}_` + Math.random().toString(36).substr(2, 9),
              currency: 'USDC'
            })
        );
      }

      const responses = await Promise.all(promises);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.transactionId).toBeDefined();
      });
    });

    test('should respond within reasonable time limits', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/blockchain/network');

      const responseTime = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(2000); // Less than 2 seconds
    });
  });
});

module.exports = {
  testWalletAddress: 'TEST_WALLET_FOR_INTEGRATION'
};
