import React, { useState } from "react";
// Bỏ import Link nếu không dùng
// import { Link } from "react-router-dom";
import { StatusModal } from "../layouts/StatusModal";
import { ConfirmationModal } from "../layouts/ConfirmationModal";

import acceptIcon from "../images/accept_icon.png";
import notAcceptIcon from "../images/not_accept_icon.png";

const initialNotificationData = [
  // Giả sử có thêm trường 'recipient' và 'content' hoặc chúng sẽ được lấy từ API khi sửa
  { id: "156782", type: "Sửa chữa tòa nhà", date: "20/12/2005", recipient: "All", content: "Nội dung sửa chữa tòa nhà" },
  { id: "156970", type: "Thanh toán hóa đơn", date: "30/10/2005", recipient: "P.713", content: "Nội dung thanh toán hóa đơn" },
  { id: "156772", type: "Nợ phí", date: "1/6/2005", recipient: "P.712", content: "Nội dung nợ phí" },
  { id: "156782-2", type: "Phí dịch vụ", date: "20/12/2005", recipient: "P.711", content: "Nội dung phí dịch vụ" },
];

// --- 1. Cập nhật NotificationItem ---
const NotificationItem = ({ item, isDeleteMode, onDeleteClick, onEditClick }) => { // Thêm onEditClick

  const handleActionClick = () => {
    if (isDeleteMode) {
      onDeleteClick(item.id); // Gọi hàm xóa nếu đang ở chế độ xóa
    } else {
      onEditClick(item); // Gọi hàm sửa nếu không ở chế độ xóa, truyền cả item
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center relative overflow-hidden mb-4">
      <div className="absolute left-4 top-3 bottom-3 w-1.5 bg-blue-500 rounded-full"></div>

      {/* Nội dung thông báo */}
      {/* Giảm thành 3 cột */}
      <div className="flex-1 grid grid-cols-3 gap-4 items-center pl-8 pr-4 text-gray-800">
        {/* Cột 1: ID */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Thông báo ID</p>
          <p className="font-semibold">{item.id}</p>
        </div>
        {/* Cột 2: Loại */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Loại thông báo</p>
          <p className="font-medium">{item.type}</p>
        </div>
        {/* Cột 3: Ngày gửi */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Ngày gửi</p>
          <p className="text-gray-600">{item.date}</p>
        </div>
      </div>

       {/* --- Nút hành động --- */}
       {/* Tách nút ra ngoài grid */}
      <div className="ml-auto flex-shrink-0 pr-2">
         <button
            onClick={handleActionClick} // Gọi hàm xử lý chung
            className={`${
              isDeleteMode
                ? "text-red-600 hover:text-red-800"
                : "text-blue-600 hover:text-blue-800"
            } hover:underline text-sm font-medium`} // Đảm bảo text-sm
          >
            {isDeleteMode ? "Xóa thông báo" : "Chỉnh sửa"}
          </button>
      </div>
    </div>
  );
};


export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotificationData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // State cho form Add (giữ nguyên)
  const [addNotificationId, setAddNotificationId] = useState("");
  const [addRecipient, setAddRecipient] = useState("");
  const [addContent, setAddContent] = useState("");

  // --- 2. THÊM STATE CHO EDIT MODAL ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null); // Thông báo đang sửa
  const [editFormData, setEditFormData] = useState({ recipient: '', content: '' }); // Dữ liệu form sửa

  // State cho modal thông báo kết quả
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null); // 'addSuccess', 'addFailure', 'deleteSuccess', 'deleteFailure', 'editSuccess', 'editFailure'
  const [statusMessage, setStatusMessage] = useState("");

  // State cho chế độ xóa & modal xác nhận (giữ nguyên)
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // --- HÀM CHO MODAL THÊM MỚI (giữ nguyên, chỉ sửa modalStatus) ---
  const handleAddNotificationClick = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddNotificationId("");
    setAddRecipient("");
    setAddContent("");
  };
  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    const newNotification = {
        id: addNotificationId,
        recipient: addRecipient,
        content: addContent,
        type: "Thông báo mới", // Hoặc loại mặc định/lấy từ form
        date: new Date().toLocaleDateString('vi-VN') // Ngày hiện tại
    };
    console.log("Submitting new notification:", newNotification);
    const isSuccess = Math.random() > 0.3; // 70% thành công

    handleCloseAddModal(); // Đóng modal thêm

    if (isSuccess) {
        setNotifications(prev => [newNotification, ...prev]); // Thêm vào đầu danh sách
        setModalStatus("addSuccess");
        setStatusMessage("Đã thêm thông báo mới!");
    } else {
        setModalStatus("addFailure");
        setStatusMessage("Lỗi! Thêm thông báo mới không thành công");
    }
    setIsStatusModalOpen(true); // Mở modal trạng thái
  };

  // --- 3. THÊM HÀM CHO MODAL CHỈNH SỬA ---
  const handleOpenEditModal = (notification) => {
    setEditingNotification(notification);
    setEditFormData({
        recipient: notification.recipient || '', // Lấy recipient từ item
        content: notification.content || ''      // Lấy content từ item
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingNotification(null);
    setEditFormData({ recipient: '', content: '' });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingNotification) return;

    console.log("Submitting edit for notification ID:", editingNotification.id, "Data:", editFormData);
    const isSuccess = Math.random() > 0.3; // 70% thành công

    handleCloseEditModal(); // Đóng modal sửa

    if (isSuccess) {
        // Cập nhật thông báo trong state
        setNotifications(prev =>
            prev.map(noti =>
                noti.id === editingNotification.id
                ? { ...noti, ...editFormData, date: new Date().toLocaleDateString('vi-VN') } // Cập nhật recipient, content và ngày
                : noti
            )
        );
        setModalStatus("editSuccess");
        setStatusMessage("Chỉnh sửa thông báo thành công!");
    } else {
        setModalStatus("editFailure");
        setStatusMessage("Chỉnh sửa thông báo không thành công!");
    }
    setIsStatusModalOpen(true); // Mở modal trạng thái
  };


  // --- HÀM XỬ LÝ XÓA (giữ nguyên) ---
  const toggleDeleteMode = () => setIsDeleteMode(!isDeleteMode);
  const handleDeleteItemClick = (id) => {
    setItemToDeleteId(id);
    setShowConfirmModal(true);
  };
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDeleteId(null);
  };
  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    const isSuccess = Math.random() > 0.3; // 70% thành công
    if (isSuccess) {
      setNotifications(notifications.filter(item => item.id !== itemToDeleteId));
      setModalStatus("deleteSuccess");
      setStatusMessage("Đã xóa thông báo thành công!");
    } else {
      setModalStatus("deleteFailure");
      setStatusMessage("Xóa thông báo không thành công!");
    }
    setIsStatusModalOpen(true);
    setItemToDeleteId(null);
  };

  // --- HÀM ĐÓNG/RENDER MODAL STATUS (giữ nguyên) ---
  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setModalStatus(null);
    setStatusMessage("");
  };
  const renderStatusModalContent = () => {
    if (!modalStatus) return null;
    const isSuccess = modalStatus.includes("Success");
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
      {/* Header và Nút (giữ nguyên) */}
      <div className="flex justify-between items-center mb-6">
       {/* ... */}
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
            isDeleteMode={isDeleteMode}
            onDeleteClick={handleDeleteItemClick}
            onEditClick={handleOpenEditModal} // <<< Truyền hàm mở modal sửa
          />
        ))}
      </div>

      {/* Add Notification Form Modal (Form giữ nguyên) */}
      <StatusModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Thêm thông báo mới"
      >
        {/* ... (Form thêm giữ nguyên) ... */}
         <form onSubmit={handleAddFormSubmit} className="space-y-4">
           {/* Thông báo ID */}
          <div>
            <label htmlFor="add-notificationId" className="block text-sm font-medium text-gray-700 mb-1">
              Thông báo ID
            </label>
            <input
              type="text"
              id="add-notificationId"
              value={addNotificationId}
              onChange={(e) => setAddNotificationId(e.target.value)}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          {/* Người nhận */}
          <div>
            <label htmlFor="add-recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Người nhận
            </label>
            <input
              type="text"
              id="add-recipient"
              value={addRecipient}
              onChange={(e) => setAddRecipient(e.target.value)}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          {/* Nội dung */}
          <div>
            <label htmlFor="add-content" className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung
            </label>
            <textarea
              id="add-content"
              rows="4"
              value={addContent}
              onChange={(e) => setAddContent(e.target.value)}
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

      {/* --- 4. THÊM MODAL CHỈNH SỬA --- */}
      <StatusModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Chỉnh sửa thông báo"
      >
        {editingNotification && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Thông báo ID (Chỉ hiển thị) */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Thông báo ID
              </label>
              <div className="w-full bg-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 min-h-[46px]">
                {editingNotification.id}
              </div>
            </div>
             {/* Người nhận */}
            <div>
              <label htmlFor="edit-recipient" className="block text-sm font-medium text-gray-700 mb-1">
                Người nhận
              </label>
              <input
                type="text"
                id="edit-recipient"
                name="recipient" // Quan trọng: name phải khớp key trong editFormData
                value={editFormData.recipient}
                onChange={handleEditFormChange}
                placeholder="Enter here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>
            {/* Nội dung chỉnh sửa */}
            <div>
              <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung chỉnh sửa
              </label>
              <textarea
                id="edit-content"
                name="content" // Quan trọng: name phải khớp key trong editFormData
                rows="4"
                // value={editFormData.content}
                onChange={handleEditFormChange}
                placeholder={editFormData.content}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              ></textarea>
            </div>
             {/* Nút Confirm */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </form>
        )}
      </StatusModal>


      {/* Confirmation Modal (Xóa) - giữ nguyên */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Chú ý: Xóa thông báo!!!"
        message="Bạn có chắc chắn muốn xóa thông báo này không?"
      />

      {/* Status Modal (Thông báo kết quả Add/Edit/Delete) - giữ nguyên */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
      >
        {renderStatusModalContent()}
      </StatusModal>
    </div>
  );
};