import React, { useState } from "react";
import { Link } from "react-router-dom";
// --- 1. Import Modals ---
import { StatusModal } from "../layouts/StatusModal";
import { ConfirmationModal } from "../layouts/ConfirmationModal"; // Modal xác nhận mới

// --- Import Icons ---
import acceptIcon from "../images/accept_icon.png";
import notAcceptIcon from "../images/not_accept_icon.png";


// --- Dữ liệu mẫu (Giả sử có thể thay đổi) ---
const initialNotificationData = [
  { id: "156782", type: "Sửa chữa tòa nhà", date: "20/12/2005" },
  { id: "156970", type: "Thanh toán hóa đơn", date: "30/10/2005" },
  { id: "156772", type: "Nợ phí", date: "1/6/2005" },
  { id: "156782-2", type: "Phí dịch vụ", date: "20/12/2005" },
  { id: "156782-2", type: "Phí dịch vụ", date: "20/12/2005" },
  { id: "156782-2", type: "Phí dịch vụ", date: "20/12/2005" },
];

// --- Component NotificationItem (Cập nhật) ---
// Thêm props: isDeleteMode, onDeleteClick
const NotificationItem = ({ item, isDeleteMode, onDeleteClick }) => {
  const handleEdit = (id) => {
    console.log(`Editing notification with ID: ${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-6 relative overflow-hidden mb-4">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
      <div className="flex-1 grid grid-cols-4 gap-4 items-center pl-4 text-gray-800">
        {/* ... (Các cột thông tin giữ nguyên) ... */}
         <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Thông báo ID</p>
          <p className="font-semibold">{item.id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Loại thông báo</p>
          <p className="font-medium">{item.type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Ngày gửi</p>
          <p className="text-gray-600">{item.date}</p>
        </div>

        {/* --- Cột 4: Chỉnh sửa hoặc Xóa --- */}
        <div className="text-right">
          {isDeleteMode ? (
            <button
              onClick={() => onDeleteClick(item.id)} // Gọi hàm xử lý xóa khi click
              className="text-red-600 hover:text-red-800 text-sm font-medium underline"
            >
              Xóa thông báo
            </button>
          ) : (
            <button
              onClick={() => handleEdit(item.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Component Trang Thông báo chính (Cập nhật) ---
export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotificationData); // Quản lý danh sách thông báo
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notificationId, setNotificationId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null); // 'addSuccess', 'addFailure', 'deleteSuccess', 'deleteFailure'
  const [statusMessage, setStatusMessage] = useState(""); // Message cho status modal

  // --- 2. State cho chế độ xóa & modal xác nhận ---
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // --- Functions for Add Modal ---
  const handleAddNotificationClick = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false); // <<<< Đảm bảo set state về false
    // Reset form
    setNotificationId("");
    setRecipient("");
    setContent("");
    };
  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting notification:", { /* ... */ });
    const isSuccess = Math.random() > 0.5;
    setModalStatus(isSuccess ? "addSuccess" : "addFailure");
    setStatusMessage(isSuccess ? "Đã thêm thông báo mới !" : "Lỗi! Thêm thông báo mới không thành công");
    handleCloseAddModal();
    setIsStatusModalOpen(true);
    // TODO: Cập nhật state 'notifications' nếu thành công
  };

  // --- 3. Functions for Delete Mode and Confirmation ---
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode); // Bật/tắt chế độ xóa
  };

  // Được gọi từ NotificationItem khi nhấn "Xóa thông báo"
  const handleDeleteItemClick = (id) => {
    setItemToDeleteId(id); // Lưu ID cần xóa
    setShowConfirmModal(true); // Mở modal xác nhận
  };

  // Đóng modal xác nhận
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDeleteId(null);
  };

  // Xử lý khi nhấn Confirm trong modal xác nhận
  const handleConfirmDelete = () => {
    console.log(`Confirming delete for ID: ${itemToDeleteId}`);
    setShowConfirmModal(false); // Đóng modal xác nhận

    // --- GIẢ LẬP API XÓA ---
    const isSuccess = Math.random() > 0.5;
    // ----------------------

    if (isSuccess) {
      // Cập nhật state nếu xóa thành công
      setNotifications(notifications.filter(item => item.id !== itemToDeleteId));
      setModalStatus("deleteSuccess");
      setStatusMessage("Đã xóa thông báo thành công !");
    } else {
      setModalStatus("deleteFailure");
      setStatusMessage("Xóa thông báo không thành công!");
    }
    setIsStatusModalOpen(true); // Mở modal trạng thái
    setItemToDeleteId(null); // Reset ID
    // Tùy chọn: Tự động tắt delete mode sau khi xóa thành công/thất bại?
    // setIsDeleteMode(false);
  };

  // --- Functions for Status Modal ---
  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setModalStatus(null);
    setStatusMessage("");
  };

  const renderStatusModalContent = () => {
    if (!modalStatus) return null;
    const isSuccess = modalStatus.includes("Success"); // Kiểm tra chuỗi 'Success'
    const icon = isSuccess ? acceptIcon : notAcceptIcon;
    return (
      <div className="flex flex-col items-center">
        <img src={icon} alt={modalStatus} className="w-20 h-20 mb-6" />
        <p className="text-xl font-semibold text-center text-gray-800">
          {statusMessage}
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Header và Nút */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Thông Báo</h1>
        <div className="flex space-x-4">
          {/* Chỉ hiển thị nút Thêm khi không ở chế độ xóa */}
          {!isDeleteMode && (
            <button
              onClick={handleAddNotificationClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2"
            >
              <span>+ Thêm thông báo</span>
            </button>
          )}
          {/* Nút Xóa / Hoàn tất */}
          <button
            onClick={toggleDeleteMode} // Bật/tắt chế độ xóa
            className={`${
              isDeleteMode
                ? "bg-gray-500 hover:bg-gray-600" // Style khi đang ở chế độ xóa (ví dụ: nút Hoàn tất)
                : "bg-red-500 hover:bg-red-600" // Style mặc định (nút Xóa)
            } text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200`}
          >
            {isDeleteMode ? "Hoàn tất" : "Xóa thông báo"}
          </button>
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            isDeleteMode={isDeleteMode} // Truyền state chế độ xóa xuống
            onDeleteClick={handleDeleteItemClick} // Truyền hàm xử lý click xóa
          />
        ))}
      </div>

      {/* Add Notification Form Modal */}
      <StatusModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Thêm thông báo mới"
      >
        <form onSubmit={handleAddFormSubmit} className="space-y-4">
           {/* Form Inputs */}
           {/* ... (Giữ nguyên các input ID, Người nhận, Nội dung) ... */}
           {/* Thông báo ID */}
          <div>
            <label htmlFor="notificationId" className="block text-sm font-medium text-gray-700 mb-1">
              Thông báo ID
            </label>
            <input
              type="text"
              id="notificationId"
              value={notificationId}
              onChange={(e) => setNotificationId(e.target.value)}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          {/* Người nhận */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Người nhận
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          {/* Nội dung */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung
            </label>
            <textarea
              id="content"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            ></textarea>
          </div>
           {/* Nút Add */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              Add
            </button>
          </div>
        </form>
      </StatusModal>

      {/* --- 4. Render Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Chú ý: Xóa thông báo!!!"
        message="Bạn có chắc chắn muốn xóa thông báo này không?"
      />

      {/* Status Modal (tái sử dụng cho cả Add và Delete) */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
      >
        {renderStatusModalContent()}
      </StatusModal>
    </div>
  );
};