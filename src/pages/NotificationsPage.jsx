import React from "react";
import { Link } from "react-router-dom"; // Dùng Link cho nút "Chỉnh sửa"

// --- Dữ liệu mẫu (Thay thế bằng dữ liệu thật) ---
const notificationData = [
  {
    id: "156782",
    type: "Sửa chữa tòa nhà",
    date: "20/12/2005",
  },
  {
    id: "156970",
    type: "Thanh toán hóa đơn",
    date: "30/10/2005",
  },
  {
    id: "156772",
    type: "Nợ phí",
    date: "1/6/2005",
  },
  {
    id: "156782-2", // ID nên là duy nhất
    type: "Phí dịch vụ",
    date: "20/12/2005",
  },
    {
    id: "156782-2", // ID nên là duy nhất
    type: "Phí dịch vụ",
    date: "20/12/2005",
  },
    {
    id: "156782-2", // ID nên là duy nhất
    type: "Phí dịch vụ",
    date: "20/12/2005",
  },
];

// --- Component hiển thị một mục thông báo ---
const NotificationItem = ({ item }) => {
  const handleEdit = (id) => {
    console.log(`Editing notification with ID: ${id}`);
    // Thêm logic điều hướng đến trang chỉnh sửa nếu cần
    // navigate(`/dashboard/notifications/edit/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-6 relative overflow-hidden mb-4">
      {/* Thanh xanh dọc bên trái */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

      {/* Thông tin thông báo */}
      <div className="flex-1 grid grid-cols-4 gap-4 items-center pl-4 text-gray-800">
        {/* Cột 1: ID */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Thông báo ID</p>
          <p className="font-semibold">{item.id}</p>
        </div>
        {/* Cột 2: Loại thông báo */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Loại thông báo</p>
          <p className="font-medium">{item.type}</p>
        </div>
        {/* Cột 3: Ngày gửi */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Ngày gửi</p>
          <p className="text-gray-600">{item.date}</p>
        </div>
        {/* Cột 4: Nút Chỉnh sửa */}
        <div className="text-right">
          <button
            onClick={() => handleEdit(item.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
          >
            Chỉnh sửa
          </button>
          {/* Hoặc dùng Link nếu muốn điều hướng */}
          {/* <Link
            to={`/dashboard/notifications/edit/${item.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
          >
            Chỉnh sửa
          </Link> */}
        </div>
      </div>
    </div>
  );
};

// --- Component Trang Thông báo chính ---
export const NotificationsPage = () => {
  const handleAddNotification = () => {
    console.log("Adding new notification...");
    // Thêm logic điều hướng đến trang thêm mới
    // navigate('/dashboard/notifications/new');
  };

  const handleDeleteNotifications = () => {
    console.log("Deleting selected notifications...");
    // Thêm logic xóa (có thể cần state để quản lý mục được chọn)
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Thông Báo</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleAddNotification}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2"
          >
            {/* Optional: Add icon */}
            {/* <svg ... > + </svg> */}
            <span>+ Thêm thông báo</span>
          </button>
          <button
            onClick={handleDeleteNotifications}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Xóa thông báo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notificationData.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// export default NotificationsPage;