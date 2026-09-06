import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle, X, Mail, Loader } from 'lucide-react';

function DeleteAccount() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      // --- REPLACE WITH REAL API CALL ---
      // const response = await fetch('/api/users/me', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!response.ok) throw new Error('Failed to delete account');

      // --- MOCK DELETE ---
      // This would trigger the Gmail API to send a confirmation email
      // await fetch('/api/email/delete-confirmation', {
      //   method: 'POST',
      //   body: JSON.stringify({ email: 'user@email.com', reason: 'user_requested' })
      // });

      toast.success('Account deletion request submitted. Please check your email to confirm.');
      setShowModal(false);
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Account Button */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">
            Delete Account
          </h3>
        </div>
        <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-4">
          Permanently delete your account and all associated data.
        </p>

        <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Warning: This action cannot be undone!
              </p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                All your trips, expenses, and data will be permanently deleted.
                A confirmation email will be sent to your registered email address.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                I understand, delete my account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">
                Delete Account
              </h2>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
                Are you sure you want to delete your account? This action is permanent and cannot be undone.
              </p>

              <div className="w-full mb-6">
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-left space-y-2">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    <strong>This will permanently delete:</strong>
                  </p>
                  <ul className="text-sm text-red-600/80 dark:text-red-400/80 list-disc list-inside space-y-1">
                    <li>Your profile and personal information</li>
                    <li>All your trips and itineraries</li>
                    <li>All expenses and split data</li>
                    <li>All chat messages and polls</li>
                  </ul>
                </div>
              </div>

              <div className="w-full mb-6">
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-2">
                  Type <strong className="text-red-500">DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmText !== 'DELETE'}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending confirmation...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-4">
                A confirmation email will be sent to your registered email address.
                You must click the link in the email to complete the deletion.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteAccount;