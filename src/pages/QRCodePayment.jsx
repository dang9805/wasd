import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- 1. Import StatusModal từ thư mục layouts ---
import { StatusModal } from "../layouts/StatusModal"; // Sửa đường dẫn

// --- Import ảnh ---
import qrImage from "../images/qr.png";
import acceptIcon from "../images/accept_icon.png";
import notAcceptIcon from "../images/not_accept_icon.png";

export const QRCodePayment = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const paymentDetails = { /* ... (dữ liệu giữ nguyên) ... */ };
  const handleGoBack = () => navigate(-1);

  const handleQRCodeClick = () => {
    const isSuccess = Math.random() > 0.5;
    setPaymentStatus(isSuccess ? "success" : "failure");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentStatus(null);
  };

  // --- 2. Chuẩn bị nội dung cho modal ---
  const renderModalContent = () => {
    if (!paymentStatus) return null;

    const isSuccess = paymentStatus === "success";
    const icon = isSuccess ? acceptIcon : notAcceptIcon;
    const message = isSuccess
      ? "Đã thanh toán thành công!"
      : "Thanh toán không thành công!";

    return (
      <div className="flex flex-col items-center">
        <img src={icon} alt={paymentStatus} className="w-20 h-20 mb-6" />
        <p className="text-xl font-semibold text-center text-gray-800">
          {message}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center text-gray-800">
      {/* ... (Tiêu đề, khối QR, khối thông tin giữ nguyên) ... */}
       {/* Tiêu đề */}
      <div className="bg-white rounded-lg shadow-md px-8 py-3 mb-8">
        <h1 className="text-2xl font-bold text-center">MÃ QR thanh toán</h1>
      </div>

      {/* Khối QR Code */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center max-w-sm w-full">
        <p className="text-sm text-gray-600 mb-4 text-center">
          Mở Ứng Dụng Ngân Hàng Quét QRCode
        </p>
        <img
          src={qrImage}
          alt="QR Code Thanh toán"
          className="w-64 h-64 object-contain cursor-pointer"
        />
      </div>

      {/* Khối Thông tin thanh toán */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg w-full">
        <div className="space-y-4 mb-6">
          {/* ... (Chi tiết giao dịch) ... */}
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
        {/* Nút Quay lại và Kiểm tra */}
        <div className="flex justify-between mt-6"> {/* Thêm mt-6 để có khoảng cách với phần trên */}
          <button
            onClick={handleGoBack}
            // Style nút quay lại (ví dụ: nền xám)
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={handleQRCodeClick}
            // Style nút kiểm tra (giữ nguyên màu xanh)
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Kiểm tra
          </button>
        </div>
      </div>


      {/* --- 3. Sử dụng StatusModal và truyền content vào children --- */}
      <StatusModal
        isOpen={showModal}
        onClose={handleCloseModal}
        // title không cần thiết ở đây, nút X tự căn chỉnh
      >
        {renderModalContent()} {/* Truyền JSX vào giữa thẻ */}
      </StatusModal>
    </div>
  );
};