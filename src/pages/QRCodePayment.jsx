import React, { useState } from "react"; // 1. Import useState
import { useNavigate } from "react-router-dom";

// --- Import ảnh QR và Icons ---
import qrImage from "../images/qr.png";
import acceptIcon from "../images/accept_icon.png"; // Icon thành công
import notAcceptIcon from "../images/not_accept_icon.png"; // Icon thất bại

// === Component Modal ===
// (Bạn có thể tách ra file riêng nếu muốn)
const PaymentStatusModal = ({ isOpen, onClose, status }) => {
  if (!isOpen) return null;

  const isSuccess = status === "success";
  const icon = isSuccess ? acceptIcon : notAcceptIcon;
  const message = isSuccess
    ? "Đã thanh toán thành công!"
    : "Thanh toán không thành công!";

  return (
    // Lớp phủ mờ
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Khung nội dung modal */}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full relative flex flex-col items-center">
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Đóng"
        >
          &times; {/* Ký tự 'X' */}
        </button>

        {/* Icon */}
        <img src={icon} alt={status} className="w-20 h-20 mb-6" />

        {/* Thông báo */}
        <p className="text-xl font-semibold text-center text-gray-800">
          {message}
        </p>
      </div>
    </div>
  );
};
// === Kết thúc Component Modal ===


// === Component Trang QR ===
export const QRCodePayment = () => {
  const navigate = useNavigate();

  // --- 2. Thêm State cho Modal ---
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failure', or null

  // --- Dữ liệu mẫu ---
  const paymentDetails = {
    transactionName: "Tiền nước tháng 8",
    amount: "1.098.000 VND",
    accountName: "Ban Kế Toán chung cư Blue Moon",
    accountNumber: "2146900000874569",
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- 3. Hàm xử lý khi click vào QR Code ---
  const handleQRCodeClick = () => {
    // --- GIẢ LẬP KẾT QUẢ THANH TOÁN ---
    // Trong thực tế, bạn sẽ gọi API ở đây
    const isSuccess = Math.random() > 0.5; // Ngẫu nhiên thành công/thất bại
    setPaymentStatus(isSuccess ? "success" : "failure");
    setShowModal(true);
    // ------------------------------------
  };

  // --- 4. Hàm đóng Modal ---
  const handleCloseModal = () => {
    setShowModal(false);
    // Tùy chọn: Nếu thành công, có thể chuyển hướng về trang PaymentPage
    if (paymentStatus === "success") {
       // navigate('/dashboard/payment'); // Hoặc navigate(-1)
    }
    setPaymentStatus(null); // Reset trạng thái
  };

  return (
    <div className="flex flex-col items-center text-gray-800">
      {/* Tiêu đề */}
      <div className="bg-white rounded-lg shadow-md px-8 py-3 mb-8">
        <h1 className="text-2xl font-bold text-center">MÃ QR thanh toán</h1>
      </div>

      {/* Khối QR Code */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center max-w-sm w-full">
        <p className="text-sm text-gray-600 mb-4 text-center">
          Mở Ứng Dụng Ngân Hàng Quét QRCode
        </p>
        {/* --- 5. Thêm onClick vào ảnh QR --- */}
        <img
          src={qrImage}
          alt="QR Code Thanh toán"
          className="w-64 h-64 object-contain cursor-pointer" // Thêm cursor-pointer
          onClick={handleQRCodeClick} // Gọi hàm xử lý khi click
        />
      </div>

      {/* Khối Thông tin thanh toán */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg w-full">
        {/* ... (Nội dung thông tin giữ nguyên) ... */}
         <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-gray-500">Tên giao dịch:</span>
            <span className="font-medium">{paymentDetails.transactionName}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-gray-500">Số tiền:</span>
            <span className="font-semibold text-blue-600">{paymentDetails.amount}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-gray-500">Tên chủ TK:</span>
            <span className="font-medium">{paymentDetails.accountName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Số tài khoản:</span>
            <span className="font-medium">{paymentDetails.accountNumber}</span>
          </div>
        </div>
        {/* Nút Quay lại */}
        <div className="flex justify-end">
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* --- 6. Render Modal --- */}
      <PaymentStatusModal
        isOpen={showModal}
        onClose={handleCloseModal}
        status={paymentStatus}
      />
    </div>
  );
};