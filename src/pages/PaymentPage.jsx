import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- Xóa Dữ liệu mẫu ---
// const paymentData = [...]; 

// --- Component hiển thị một mục thanh toán ---
const PaymentItem = ({ item }) => {
  const navigate = useNavigate();
  // BE trả về status_text là "Đã thanh toán" hoặc "Chưa thanh toán"
  const isPaid = item.status_text === "Đã thanh toán";
  
  // Format ngày: BE trả về payment_date (null nếu chưa thanh toán)
  const formattedPaymentDate = item.payment_date 
    ? new Date(item.payment_date).toLocaleDateString('vi-VN') 
    : "---";

  const handlePayInvoice = (invoiceId) => {
    console.log(`Navigating to QR payment for ID: ${invoiceId}`);
    // Điều hướng đến trang QR với ID hóa đơn
    navigate(`/dashboard/payment/${invoiceId}/qr`); 
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center space-x-6 relative overflow-hidden mb-4">
      {/* Thanh xanh dọc bên trái */}
      <div className="absolute left-4 top-3 bottom-3 w-1.5 bg-blue-500 rounded-full"></div>
      {/* Thông tin thanh toán */}
      <div className="flex-1 grid grid-cols-5 gap-4 items-center pl-8"> 
        {/* Cột 1: ID */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Thanh toán ID</p>
          <p className="font-semibold text-gray-800">{item.id}</p>
        </div>
        {/* Cột 2: Loại phí */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Loại phí</p>
          {/* BE field: feetype */}
          <p className="font-medium text-gray-700">{item.feetype}</p>
        </div>
        {/* Cột 3: Ngày thanh toán */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Ngày thanh toán</p>
          <p className="text-gray-600">{formattedPaymentDate}</p>
        </div>
        {/* Cột 4: Hình thức */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Hình thức thanh toán</p>
          {/* BE field: payment_form */}
          <p className="text-gray-600">{item.payment_form || "---"}</p>
        </div>
        {/* Cột 5: Trạng thái & Nút */}
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
          <p
            className={`font-semibold mb-2 ${
              isPaid ? "text-green-600" : "text-red-600"
            }`}
          >
            {/* BE field: status_text */}
            {item.status_text}
          </p>
          {!isPaid && (
            <button
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
    // Thêm state để quản lý dữ liệu, loading và lỗi
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Hàm Fetch dữ liệu từ BE
    const fetchPayments = async () => {
        setIsLoading(true);
        setError(null);

        // Sử dụng endpoint /api/payments
        try {
            // Sử dụng /api để proxy đến http://localhost:3000/payments
            const response = await fetch('/api/payments'); 
            if (!response.ok) {
                // Cố gắng đọc lỗi chi tiết từ body nếu có
                const errorData = await response.json().catch(() => ({ error: 'Lỗi không xác định khi tải dữ liệu.' }));
                throw new Error(errorData.error || 'Không thể tải dữ liệu thanh toán.');
            }
            const data = await response.json();
            // Data đã được BE tự động mapping status_text và is_paid
            setPayments(data);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Gọi API khi component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    // Xử lý Loading State
    if (isLoading) {
        return <div className="text-white text-lg p-4">Đang tải danh sách thanh toán...</div>;
    }

    // Xử lý Error State
    if (error) {
        return <div className="text-red-400 text-lg p-4">Lỗi tải dữ liệu: {error}</div>;
    }
    
    // Hiển thị nội dung
    const renderContent = () => {
        if (payments.length === 0) {
            return (
                <div className="bg-white p-6 rounded-lg text-center text-gray-500 shadow-md">
                    Không có hóa đơn thanh toán nào để hiển thị.
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {payments.map((item) => (
                    <PaymentItem key={item.id} item={item} />
                ))}
            </div>
        );
    };

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-6 text-white">Thanh toán</h1>
            {renderContent()}
        </div>
    );
};