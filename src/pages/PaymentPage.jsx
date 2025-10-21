import React from "react";
// --- 1. Import useNavigate ---
import { useNavigate } from "react-router-dom";

// --- Dữ liệu mẫu ---
const paymentData = [
  {
    id: "156782",
    feeType: "Phí sửa chữa",
    paymentDate: "20/12/2005",
    paymentMethod: "Online",
    status: "Đã thanh toán",
  },
  {
    id: "156970",
    feeType: "Tiền điện tháng",
    paymentDate: "30/10/2005",
    paymentMethod: "Offline",
    status: "Đã thanh toán",
  },
  {
    id: "156772",
    feeType: "Tiền nước tháng",
    paymentDate: null,
    paymentMethod: null,
    status: "Chưa thanh toán",
  },
  {
    id: "156782-2", // Đảm bảo ID là duy nhất nếu có thể
    feeType: "Phí dịch vụ",
    paymentDate: null,
    paymentMethod: null,
    status: "Chưa thanh toán",
  },
  {
    id: "156782-2", // Đảm bảo ID là duy nhất nếu có thể
    feeType: "Phí dịch vụ",
    paymentDate: null,
    paymentMethod: null,
    status: "Chưa thanh toán",
  },
  {
    id: "156782-2", // Đảm bảo ID là duy nhất nếu có thể
    feeType: "Phí dịch vụ",
    paymentDate: null,
    paymentMethod: null,
    status: "Chưa thanh toán",
  },
];

// --- Component hiển thị một mục thanh toán ---
const PaymentItem = ({ item }) => {
  // --- 2. Khởi tạo hook navigate ---
  const navigate = useNavigate();
  const isPaid = item.status === "Đã thanh toán";

  // --- 3. Cập nhật hàm xử lý ---
  const handlePayInvoice = (invoiceId) => {
    console.log(`Navigating to QR payment for ID: ${invoiceId}`);
    // Điều hướng đến trang QR với ID hóa đơn
    navigate(`/dashboard/payment/${invoiceId}/qr`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-6 relative overflow-hidden mb-4">
      {/* Thanh xanh dọc bên trái */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

      {/* Thông tin thanh toán */}
      <div className="flex-1 grid grid-cols-5 gap-4 items-center pl-4">
        {/* Cột 1: ID */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Thanh toán ID</p>
          <p className="font-semibold text-gray-800">{item.id}</p>
        </div>
        {/* Cột 2: Loại phí */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Loại phí</p>
          <p className="font-medium text-gray-700">{item.feeType}</p>
        </div>
        {/* Cột 3: Ngày thanh toán */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Ngày thanh toán</p>
          <p className="text-gray-600">{item.paymentDate || "---"}</p>
        </div>
        {/* Cột 4: Hình thức */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Hình thức thanh toán</p>
          <p className="text-gray-600">{item.paymentMethod || "---"}</p>
        </div>
        {/* Cột 5: Trạng thái & Nút */}
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
          <p
            className={`font-semibold mb-2 ${
              isPaid ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.status}
          </p>
          {!isPaid && (
            <button
              // --- 4. Gọi hàm xử lý với ID ---
              onClick={() => handlePayInvoice(item.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Thanh toán hóa đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Component Trang Thanh toán chính ---
export const PaymentPage = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">Thanh toán</h1>
      <div className="space-y-4">
        {paymentData.map((item) => (
          // --- 5. Sử dụng ID thật làm key ---
          <PaymentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};