import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PlanToggl() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const togglePlan = async () => {
    if (user.role !== 'admin') return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const endpoint = user.tenant.plan === 'free' ? 'upgrade' : 'downgrade';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/tenants/${user.tenant.slug}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        // Reload the page to reflect changes
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(data.message || 'Error changing plan');
      }
    } catch (error) {
      setMessage('Error changing plan');
    } finally {
      setLoading(false);
    }
  };

  if (user.role !== 'admin') return null;

  const isPro = user.tenant.plan === 'pro';

  return (
    <div className="mb-8 bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            Subscription Plan
          </h3>
          <div className="mt-2 flex items-center">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isPro ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
            <p className="ml-3 text-sm text-gray-600">
              {isPro 
                ? 'Unlimited notes with Pro plan' 
                : 'Free plan limited to 3 notes'}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={togglePlan}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center ${
              isPro 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              isPro ? 'Downgrade to Free' : 'Upgrade to Pro'
            )}
          </button>
        </div>
      </div>
      {message && (
        <div className={`mt-4 p-3 rounded-md text-center ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}