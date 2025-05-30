// components/ui/Modal.jsx
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> 
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative shadow-lg">
            <div className="m-5">
            <button
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
            onClick={onClose}
            >
            ✕
            </button>
            </div>
            {children}
      </div>
    </div>
  );
}
