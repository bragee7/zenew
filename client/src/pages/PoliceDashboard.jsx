import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PoliceDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAlert, setNewAlert] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    fetchCases();
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCases = async () => {
    try {
      const response = await sosAPI.getCases();
      const newCases = response.data.cases || [];
      
      if (newCases.length > lastCount && lastCount > 0) {
        setNewAlert(true);
        playAlertSound();
        setTimeout(() => setNewAlert(false), 5000);
      }
      
      setLastCount(newCases.length);
      setCases(newCases);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cases');
      setLoading(false);
    }
  };

  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.frequency.value = 600;
      }, 200);
      
      setTimeout(() => {
        oscillator.frequency.value = 800;
      }, 400);
      
      setTimeout(() => {
        oscillator.frequency.value = 1000;
      }, 600);
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 800);
    } catch (err) {
      console.error('Error playing alert sound:', err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCases = cases.filter(c => c.status === 'Pending');
  const resolvedCases = cases.filter(c => c.status === 'Resolved');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-police-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-8 p-6 rounded-2xl ${newAlert ? 'alert-flash' : 'bg-gradient-to-r from-red-900 to-red-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Police Control Center</h1>
              <p className="text-gray-300">Welcome, Officer {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white">{pendingCases.length}</div>
              <div className="text-gray-300">Active Alerts</div>
            </div>
          </div>
        </div>

        {newAlert && (
          <div className="bg-red-600 text-white px-6 py-4 rounded-xl mb-6 animate-bounce text-center text-xl font-bold">
            🚨 NEW EMERGENCY ALERT RECEIVED! 🚨
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-6">
            {error}
            <button onClick={fetchCases} className="ml-4 underline">Retry</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{pendingCases.length}</div>
                <div className="text-gray-300">Pending Cases</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{resolvedCases.length}</div>
                <div className="text-gray-300">Resolved Cases</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{cases.length}</div>
                <div className="text-gray-300">Total Cases</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Emergency Cases</h2>
          </div>

          {cases.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400 text-lg">No emergency cases reported</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {cases.map((caseItem) => (
                <Link 
                  key={caseItem.id} 
                  to={`/case/${caseItem.id}`}
                  className="case-card block p-6 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        caseItem.status === 'Pending' ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          Emergency Alert
                        </h3>
                        <p className="text-gray-400 text-sm">
                          From: {caseItem.userEmail || 'Unknown User'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {formatDate(caseItem.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        caseItem.status === 'Pending' 
                          ? 'bg-red-900 text-red-200' 
                          : 'bg-green-900 text-green-200'
                      }`}>
                        {caseItem.status}
                      </span>
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {caseItem.locationLink && (
                    <div className="mt-3 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <a 
                        href={caseItem.locationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm underline flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Location on Google Maps
                      </a>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
