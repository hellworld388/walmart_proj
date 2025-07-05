import React, { useState } from "react";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  onSignOut: () => void;
  className?: string;
}

export function SignOutButton({
  onSignOut,
  className = "",
}: SignOutButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onSignOut();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium text-sm transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
        onClick={handleClick}
        title="Sign Out"
      >
        <LogOut size={16} />
        <span>Sign Out</span>
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Sign Out
              </h3>
            </div>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to sign out? You'll need to log in again to
              access your account.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
                onClick={handleConfirm}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
