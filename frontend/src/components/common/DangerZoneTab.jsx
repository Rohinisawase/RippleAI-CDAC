import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

const DangerZoneTab = ({ onDelete }) => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  const REQUIRED_TEXT = "DELETE";

  const handleDelete = async () => {
    if (confirmationText !== REQUIRED_TEXT) return;

    try {
      setIsDeleting(true);
      // Wait for your parent onDelete function (e.g., an API call)
      await onDelete();
      
      // Navigate back to login
      navigate('/login');
    } catch (error) {
      console.error("Deletion failed:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rose-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Account Security</h2>
      </div>

      {!isConfirming ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Account</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Deleting your account will permanently remove your donation history and profile. 
            This action cannot be reversed.
          </p>
          <button
            onClick={() => setIsConfirming(true)}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      ) : (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-8 shadow-md animate-in zoom-in-95 duration-200">
          <button 
            disabled={isDeleting}
            onClick={() => setIsConfirming(false)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-500 mb-4 hover:text-rose-700 disabled:opacity-50"
          >
            <ArrowLeft className="w-3 h-3" /> Go Back
          </button>

          <h3 className="text-xl font-black text-rose-700 mb-2">Are you absolutely sure?</h3>
          <p className="text-rose-600/80 text-sm mb-6">
            Please type <span className="font-mono font-bold bg-rose-200 px-1.5 py-0.5 rounded text-rose-800">{REQUIRED_TEXT}</span> to confirm.
          </p>

          <div className="space-y-4">
            <input
              type="text"
              disabled={isDeleting}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type ${REQUIRED_TEXT} to confirm`}
              className="w-full px-4 py-3 rounded-lg border-2 border-rose-200 focus:border-rose-500 outline-none transition-all font-medium text-rose-900 disabled:bg-rose-100/50"
              autoFocus
            />
            
            <button
              onClick={handleDelete}
              disabled={confirmationText !== REQUIRED_TEXT || isDeleting}
              className="w-full py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-200 disabled:text-rose-400"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Permanently Delete Everything"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZoneTab;