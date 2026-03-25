import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sosAPI, getMediaUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPolice } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const response = await sosAPI.getCase(id);
      setCaseData(response.data.case);
      setNotes(response.data.case.notes || '');
      setLoading(false);
    } catch (err) {
      setError('Failed to load case details');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await sosAPI.updateCase(id, { status: newStatus, notes });
      await fetchCase();
    } catch (err) {
      setError('Failed to update case');
    } finally {
      setUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    setSaving(true);
    try {
      await sosAPI.updateCase(id, { notes });
      await fetchCase();
    } catch (err) {
      setError('Failed to update notes');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleVideoError = () => {
    console.error('Video playback error');
  };

  const handleAudioError = () => {
    console.error('Audio playback error');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-police-blue"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Case not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-police-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Emergency Case Details</h1>
              <p className="text-gray-400">Case ID: {caseData.id}</p>
            </div>
            <span className={`px-6 py-3 rounded-full text-lg font-bold ${
              caseData.status === 'Pending' 
                ? 'bg-red-900 text-red-200 animate-pulse' 
                : 'bg-green-900 text-green-200'
            }`}>
              {caseData.status}
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Video Recording</h3>
                {caseData.videoUrl ? (
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <video 
                      ref={videoRef}
                      src={getMediaUrl(caseData.videoUrl)}
                      controls
                      className="w-full"
                      onError={handleVideoError}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-xl p-12 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">No video available</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Audio Recording</h3>
                {caseData.audioUrl ? (
                  <div className="bg-gray-900 rounded-xl p-6">
                    <audio 
                      ref={audioRef}
                      src={getMediaUrl(caseData.audioUrl)}
                      controls
                      className="w-full"
                      onError={handleAudioError}
                    >
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-xl p-12 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-gray-500">No audio available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Location</h3>
            {caseData.locationLink ? (
              <div className="space-y-3">
                <a 
                  href={caseData.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Open in Google Maps</span>
                </a>
                <p className="text-gray-400 text-sm break-all">
                  {caseData.locationLink}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No location data available</p>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Case Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Reporter:</span>
                <span className="text-white">{caseData.userEmail || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-white text-sm">{formatDate(caseData.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${
                  caseData.status === 'Pending' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {caseData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 bg-gray-900 text-white border border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add notes about this case..."
          />
          <button
            onClick={handleNotesUpdate}
            disabled={saving || notes === caseData.notes}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>

        {isPolice && (
          <div className="mt-6 bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Case Actions</h3>
            <div className="flex flex-wrap gap-4">
              {caseData.status === 'Pending' && (
                <button
                  onClick={() => handleStatusUpdate('Resolved')}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mark as Resolved</span>
                </button>
              )}
              
              {caseData.status === 'Resolved' && (
                <button
                  onClick={() => handleStatusUpdate('Pending')}
                  disabled={updating}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Reopen Case</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
