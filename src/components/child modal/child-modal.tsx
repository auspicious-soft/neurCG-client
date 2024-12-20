interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    message?: string;
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Close",
    message = "Are you sure you want to close this window? Any unsaved changes will be lost."
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[51]">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;