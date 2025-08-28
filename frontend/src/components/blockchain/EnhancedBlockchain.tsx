import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  DollarSign,
  BarChart3,
  Coins
} from 'lucide-react';

// Type definitions
interface WalletBalance {
  SOL: number;
  USDC: number;
  CCOIN: number;
}

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: WalletBalance;
  network: string;
  isReal: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  from: string;
  to: string;
}

interface NetworkStatus {
  tps?: number;
  blockTime?: number;
  activeValidators?: number;
  totalTransactions?: number;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  processingTime?: string;
  gasUsed?: number;
  error?: string;
}

interface PaymentState {
  amount: string;
  currency: string;
  processing: boolean;
  result: PaymentResult | null;
}

interface StakingInfo {
  totalStaked?: number;
  apy: number;
  participants?: number;
}

interface UserStake {
  stakeId: string;
  amount: number;
  duration: number;
  projectedRewards?: number;
}

interface StakingState {
  amount: string;
  duration: number;
  processing: boolean;
  stakingInfo: StakingInfo | null;
  userStakes: UserStake[];
}

// Enhanced Blockchain Wallet Component
export const EnhancedWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: { SOL: 0, USDC: 0, CCOIN: 0 },
    network: 'devnet',
    isReal: false
  });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);

  const connectWallet = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate wallet connection with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWalletAddress = 'DEMO_' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const response = await fetch('/api/blockchain/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          walletAddress: mockWalletAddress,
          signature: 'enhanced_signature_' + Math.random().toString(36).substr(2, 50)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setWallet({
          connected: true,
          address: data.address,
          balance: data.balance,
          network: data.network,
          isReal: data.isReal
        });
        
        // Fetch initial transactions
        fetchTransactions();
        fetchNetworkStatus();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      await fetch('/api/blockchain/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setWallet({
        connected: false,
        address: null,
        balance: { SOL: 0, USDC: 0, CCOIN: 0 },
        network: 'devnet',
        isReal: false
      });
      setTransactions([]);
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch('/api/blockchain/transactions?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  const fetchNetworkStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/blockchain/network');
      if (response.ok) {
        const data = await response.json();
        setNetworkStatus(data.stats);
      }
    } catch (error) {
      console.error('Error fetching network status:', error);
    }
  }, []);

  useEffect(() => {
    // Fetch initial wallet state
    const checkWalletConnection = async () => {
      try {
        const response = await fetch('/api/blockchain/wallet', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.connected) {
            setWallet(data);
            fetchTransactions();
            fetchNetworkStatus();
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();

    // Set up real-time updates
    const interval = setInterval(() => {
      if (wallet.connected) {
        fetchNetworkStatus();
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [wallet.connected, fetchTransactions, fetchNetworkStatus]);

  return (
    <div className="enhanced-wallet">
      <motion.div 
        className="wallet-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wallet-title">
          <Wallet className="title-icon" />
          <h2>Enhanced Blockchain Wallet</h2>
          {wallet.isReal && <Shield className="real-indicator" />}
        </div>
        
        {!wallet.connected ? (
          <motion.button
            className="connect-button"
            onClick={connectWallet}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <RefreshCw className="spinning" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet />
                Connect Wallet
              </>
            )}
          </motion.button>
        ) : (
          <div className="wallet-actions">
            <motion.button
              className="disconnect-button"
              onClick={disconnectWallet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Disconnect
            </motion.button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {wallet.connected && (
          <motion.div
            className="wallet-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Wallet Information */}
            <div className="wallet-info">
              <div className="wallet-address">
                <strong>Address:</strong>
                <span className="address-display">
                  {wallet.address?.substring(0, 6)}...{wallet.address?.substring(-4)}
                  <ExternalLink className="external-link" />
                </span>
              </div>
              <div className="network-info">
                <strong>Network:</strong> {wallet.network}
                {wallet.isReal ? (
                  <span className="real-badge">REAL</span>
                ) : (
                  <span className="demo-badge">DEMO</span>
                )}
              </div>
            </div>

            {/* Balance Display */}
            <div className="balance-section">
              <h3>Portfolio Balance</h3>
              <div className="balance-grid">
                <motion.div 
                  className="balance-card sol"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="balance-header">
                    <Coins className="balance-icon" />
                    <span className="balance-symbol">SOL</span>
                  </div>
                  <div className="balance-amount">
                    {wallet.balance.SOL?.toFixed(4) || '0.0000'}
                  </div>
                  <div className="balance-usd">
                    ≈ ${((wallet.balance.SOL || 0) * 23.45).toFixed(2)}
                  </div>
                </motion.div>

                <motion.div 
                  className="balance-card usdc"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="balance-header">
                    <DollarSign className="balance-icon" />
                    <span className="balance-symbol">USDC</span>
                  </div>
                  <div className="balance-amount">
                    {wallet.balance.USDC?.toFixed(2) || '0.00'}
                  </div>
                  <div className="balance-usd">
                    ≈ ${wallet.balance.USDC?.toFixed(2) || '0.00'}
                  </div>
                </motion.div>

                <motion.div 
                  className="balance-card ccoin"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="balance-header">
                    <TrendingUp className="balance-icon" />
                    <span className="balance-symbol">CCOIN</span>
                  </div>
                  <div className="balance-amount">
                    {wallet.balance.CCOIN?.toFixed(0) || '0'}
                  </div>
                  <div className="balance-usd">
                    ≈ ${((wallet.balance.CCOIN || 0) * 0.85).toFixed(2)}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Network Status */}
            {networkStatus && (
              <div className="network-status">
                <h3>
                  <BarChart3 />
                  Network Status
                </h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">TPS</span>
                    <span className="status-value">{networkStatus.tps?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Block Time</span>
                    <span className="status-value">{networkStatus.blockTime || 'N/A'}ms</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Validators</span>
                    <span className="status-value">{networkStatus.activeValidators?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Total TXs</span>
                    <span className="status-value">{networkStatus.totalTransactions?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="transactions-section">
                <h3>
                  <Clock />
                  Recent Transactions
                </h3>
                <div className="transactions-list">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      className="transaction-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="tx-icon">
                        {tx.status === 'completed' ? (
                          <CheckCircle className="success" />
                        ) : (
                          <Clock className="pending" />
                        )}
                      </div>
                      <div className="tx-details">
                        <div className="tx-amount">
                          {tx.amount} {tx.currency}
                        </div>
                        <div className="tx-meta">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="tx-status">
                        <span className={`status-badge ${tx.status}`}>
                          {tx.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Payment Component
interface PaymentProps {
  contentId: string;
  creatorAddress: string;
  onPaymentComplete?: (result: PaymentResult) => void;
}

export const EnhancedPayment = ({ contentId, creatorAddress, onPaymentComplete }: PaymentProps) => {
  const [payment, setPayment] = useState<PaymentState>({
    amount: '',
    currency: 'USDC',
    processing: false,
    result: null
  });

  const processPayment = useCallback(async () => {
    if (!payment.amount || parseFloat(payment.amount) <= 0) {
      return;
    }

    setPayment(prev => ({ ...prev, processing: true, result: null }));

    try {
      const response = await fetch('/api/blockchain/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contentId,
          amount: parseFloat(payment.amount),
          creatorAddress,
          currency: payment.currency
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPayment(prev => ({
          ...prev,
          result: { success: true, ...data }
        }));
        onPaymentComplete?.(data);
      } else {
        setPayment(prev => ({
          ...prev,
          result: { success: false, error: data.error }
        }));
      }
    } catch (error) {
      setPayment(prev => ({
        ...prev,
        result: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setPayment(prev => ({ ...prev, processing: false }));
    }
  }, [payment.amount, payment.currency, contentId, creatorAddress, onPaymentComplete]);

  return (
    <motion.div 
      className="enhanced-payment"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="payment-header">
        <CreditCard />
        <h3>Enhanced Payment</h3>
      </div>

      <div className="payment-form">
        <div className="amount-input">
          <label>Amount</label>
          <div className="input-group">
            <input
              type="number"
              value={payment.amount}
              onChange={(e) => setPayment(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <select
              value={payment.currency}
              onChange={(e) => setPayment(prev => ({ ...prev, currency: e.target.value }))}
            >
              <option value="USDC">USDC</option>
              <option value="SOL">SOL</option>
              <option value="CCOIN">CCOIN</option>
            </select>
          </div>
        </div>

        <motion.button
          className="pay-button"
          onClick={processPayment}
          disabled={payment.processing || !payment.amount}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {payment.processing ? (
            <>
              <RefreshCw className="spinning" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard />
              Pay Creator
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {payment.result && (
          <motion.div
            className={`payment-result ${payment.result.success ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {payment.result.success ? (
              <div className="success-content">
                <CheckCircle />
                <div>
                  <h4>Payment Successful!</h4>
                  <p>Transaction ID: {payment.result.transactionId?.substring(0, 16)}...</p>
                  <p>Processing Time: {payment.result.processingTime}</p>
                  <p>Gas Used: {payment.result.gasUsed?.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="error-content">
                <AlertTriangle />
                <div>
                  <h4>Payment Failed</h4>
                  <p>{payment.result.error}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Staking Component
export const EnhancedStaking = () => {
  const [staking, setStaking] = useState<StakingState>({
    amount: '',
    duration: 30,
    processing: false,
    stakingInfo: null,
    userStakes: []
  });

  const fetchStakingInfo = useCallback(async () => {
    try {
      const response = await fetch('/api/blockchain/staking');
      if (response.ok) {
        const data = await response.json();
        setStaking(prev => ({ ...prev, stakingInfo: data.stakingPool }));
      }
    } catch (error) {
      console.error('Error fetching staking info:', error);
    }
  }, []);

  const stakeTokens = useCallback(async () => {
    if (!staking.amount || parseFloat(staking.amount) <= 0) {
      return;
    }

    setStaking(prev => ({ ...prev, processing: true }));

    try {
      const response = await fetch('/api/blockchain/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(staking.amount),
          duration: staking.duration
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStaking(prev => ({
          ...prev,
          amount: '',
          userStakes: [...prev.userStakes, data]
        }));
        fetchStakingInfo();
      }
    } catch (error) {
      console.error('Staking error:', error);
    } finally {
      setStaking(prev => ({ ...prev, processing: false }));
    }
  }, [staking.amount, staking.duration, fetchStakingInfo]);

  useEffect(() => {
    fetchStakingInfo();
  }, [fetchStakingInfo]);

  return (
    <motion.div 
      className="enhanced-staking"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="staking-header">
        <TrendingUp />
        <h3>Token Staking</h3>
      </div>

      {staking.stakingInfo && (
        <div className="staking-stats">
          <div className="stat-item">
            <span className="stat-label">Total Staked</span>
            <span className="stat-value">
              {staking.stakingInfo.totalStaked?.toLocaleString()} CCOIN
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">APY</span>
            <span className="stat-value">{staking.stakingInfo.apy}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Participants</span>
            <span className="stat-value">
              {staking.stakingInfo.participants?.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="staking-form">
        <div className="form-group">
          <label>Amount to Stake (CCOIN)</label>
          <input
            type="number"
            value={staking.amount}
            onChange={(e) => setStaking(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Staking Duration</label>
          <select
            value={staking.duration}
            onChange={(e) => setStaking(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
          >
            <option value={30}>30 days (12.5% APY)</option>
            <option value={60}>60 days (15.0% APY)</option>
            <option value={90}>90 days (18.5% APY)</option>
          </select>
        </div>

        <motion.button
          className="stake-button"
          onClick={stakeTokens}
          disabled={staking.processing || !staking.amount}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {staking.processing ? (
            <>
              <RefreshCw className="spinning" />
              Staking...
            </>
          ) : (
            <>
              <TrendingUp />
              Stake Tokens
            </>
          )}
        </motion.button>
      </div>

      {staking.userStakes.length > 0 && (
        <div className="user-stakes">
          <h4>Your Stakes</h4>
          {staking.userStakes.map((stake, index) => (
            <motion.div
              key={stake.stakeId}
              className="stake-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stake-details">
                <span>{stake.amount} CCOIN</span>
                <span>{stake.duration} days</span>
                <span>+{stake.projectedRewards?.toFixed(2)} CCOIN</span>
              </div>
              <div className="stake-status">
                <Clock />
                Active
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default {
  EnhancedWallet,
  EnhancedPayment,
  EnhancedStaking
};
