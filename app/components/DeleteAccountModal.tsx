import React from 'react';
import { AlertCircle, X, Mail } from 'lucide-react';

// Usage example:
/*
import DeleteAccountModal from './DeleteAccountModal';

// In your component:
const [showDeleteModal, setShowDeleteModal] = useState(false);

// JSX:
<DeleteAccountModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={() => {
    // Optional: Add any additional logic here
    toast.success('Please check your email for deletion instructions.');
  }}
/>

// Button to trigger:
<button onClick={() => setShowDeleteModal(true)}>
  Delete Account
</button>
*/

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onConfirm
                                                               }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mt-3 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Account</h3>

                    <div className="mt-4 px-7 py-3">
                        <p className="text-sm text-gray-600 mb-4">
                            To delete your account, please send an email to our support team.
                            We will process your request and permanently remove all your data.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-center">
                                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-blue-800">
                  info@muscleconnect.com
                </span>
                            </div>
                            <p className="text-xs text-blue-600 mt-2 text-center">
                                Please include your account details in the email
                            </p>
                        </div>

                        <p className="text-xs text-gray-500">
                            <strong>Important:</strong> This action cannot be undone.
                            All your data will be permanently removed from our servers.
                        </p>
                    </div>

                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                        >
                            I Understand
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;