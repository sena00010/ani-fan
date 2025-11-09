import React from 'react';

interface JoinNakamaModalProps {
  isOpen: boolean;
  nakamaName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const JoinNakamaModal: React.FC<JoinNakamaModalProps> = ({
  isOpen,
  nakamaName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md w-full">
        <h3 className="text-white font-bold text-2xl mb-4">Nakama&apos;ya Katıl</h3>
        <p className="text-gray-300 mb-6">
          {nakamaName} topluluğuna katılmak istediğinizden emin misiniz? Bu toplulukta anime ve
          manga deneyimlerinizi paylaşabilir, diğer üyelerle sohbet edebilirsiniz.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Katıl
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinNakamaModal;

