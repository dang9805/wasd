import React, { useState, useEffect } from "react";
// Bỏ import Link nếu không dùng
// import { Link } from "react-router-dom";
import { StatusModal } from "../layouts/StatusModal";
import { ConfirmationModal } from "../layouts/ConfirmationModal";

import acceptIcon from "../images/accept_icon.png";
import notAcceptIcon from "../images/not_accept_icon.png";

// --- Xóa initialNotificationData ---
// const initialNotificationData = [...]; 

// --- Component hiển thị một mục thông báo (Giữ nguyên) ---
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
        {/* Cột 2: Người nhận (apartment_id) */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Người nhận</p>
          {/* BE trả về apartment_id, dùng nó làm recipient */}
          <p className="font-medium">{item.apartment_id || item.recipient}</p>
        </div>
        {/* Cột 3: Ngày gửi */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Ngày gửi</p>
          <p className="text-gray-600">
             {/* Định dạng ngày tháng từ BE */}
            {item.notification_date ? new Date(item.notification_date).toLocaleDateString('vi-VN') : '---'}
          </p>
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
  const [notifications, setNotifications] = useState([]); // Khởi tạo rỗng
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state error
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // State cho form Add
  const [addNotificationId, setAddNotificationId] = useState("");
  const [addRecipient, setAddRecipient] = useState(""); // recipient tương ứng với apartment_id
  const [addContent, setAddContent] = useState("");

  // State cho EDIT MODAL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [editFormData, setEditFormData] = useState({ recipient: '', content: '' }); 

  // State cho modal thông báo kết quả
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null); 
  const [statusMessage, setStatusMessage] = useState("");

  // State cho chế độ xóa & modal xác nhận
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  
  // ====================================================================
  // --- 1. HÀM FETCH DỮ LIỆU TỪ API (GET /notifications) ---
  // ====================================================================
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/notifications'); 
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu thông báo.');
        }
        const data = await response.json();
        // BE trả về apartment_id, date dưới dạng ISO. FE hiển thị recipient, date định dạng VN.
        // BE fields: id, content, apartment_id, notification_date
        setNotifications(data);
    } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ====================================================================
  // --- 2. HÀM THÊM MỚI (POST /notifications) ---
  // ====================================================================
  const handleAddNotificationClick = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddNotificationId("");
    setAddRecipient("");
    setAddContent("");
  };
  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // apartment_id (người nhận) và content là bắt buộc
    if (!addRecipient || !addContent) {
      setError("Vui lòng điền đủ Người nhận và Nội dung.");
      return;
    }
    
    handleCloseAddModal(); // Đóng modal thêm

    try {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                apartment_id: addRecipient, // recipient là apartment_id trong BE
                content: addContent 
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Lỗi! Thêm thông báo mới không thành công");
        }

        // Thành công: fetch lại danh sách
        fetchNotifications();
        setModalStatus("addSuccess");
        setStatusMessage("Đã thêm thông báo mới!");

    } catch (err) {
        console.error('API Error:', err);
        setModalStatus("addFailure");
        setStatusMessage(err.message);
    }
    setIsStatusModalOpen(true); // Mở modal trạng thái
  };

  // ====================================================================
  // --- 3. HÀM CHỈNH SỬA (PUT /notifications/:id) ---
  // ====================================================================
  const handleOpenEditModal = (notification) => {
    setEditingNotification(notification);
    // recipient là apartment_id trong BE
    setEditFormData({
        recipient: notification.apartment_id || notification.recipient || '', 
        content: notification.content || ''
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingNotification) return;

    handleCloseEditModal(); // Đóng modal sửa
    setError(null);

    try {
        const response = await fetch(`/api/notifications/${editingNotification.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apartment_id: editFormData.recipient, // recipient là apartment_id trong BE
                content: editFormData.content
            }),
        });

        if (!response.ok) {
            throw new Error("Chỉnh sửa thông báo không thành công!");
        }

        // Thành công: fetch lại danh sách
        fetchNotifications();
        setModalStatus("editSuccess");
        setStatusMessage("Chỉnh sửa thông báo thành công!");

    } catch (err) {
        console.error('API Error:', err);
        setModalStatus("editFailure");
        setStatusMessage(err.message);
    }
    setIsStatusModalOpen(true); // Mở modal trạng thái
  };


  // ====================================================================
  // --- 4. HÀM XỬ LÝ XÓA (DELETE /notifications/:id) ---
  // ====================================================================
  const toggleDeleteMode = () => setIsDeleteMode(!isDeleteMode);
  const handleDeleteItemClick = (id) => {
    setItemToDeleteId(id);
    setShowConfirmModal(true);
  };
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDeleteId(null);
  };
  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    setError(null);
    
    try {
        const response = await fetch(`/api/notifications/${itemToDeleteId}`, {
            method: 'DELETE',
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Xóa thông báo không thành công!");
        }

        // Thành công: fetch lại danh sách
        fetchNotifications();
        setModalStatus("deleteSuccess");
        setStatusMessage("Đã xóa thông báo thành công!");

    } catch (err) {
        console.error('API Error:', err);
        setModalStatus("deleteFailure");
        setStatusMessage(err.message);
    } finally {
        setItemToDeleteId(null);
        setIsStatusModalOpen(true);
    }
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

  // --- RENDER LOADING VÀ ERROR ---
  if (isLoading) {
    return <div className="text-white text-lg p-4">Đang tải thông báo...</div>;
  }
  
  if (error) {
    return <div className="text-red-400 text-lg p-4">Lỗi tải dữ liệu: {error}</div>;
  }
  // -----------------------------

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
        {notifications.length === 0 ? (
           <div className="bg-white p-6 rounded-lg text-center text-gray-500">
              Không có thông báo nào để hiển thị.
           </div>
        ) : (
             notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  isDeleteMode={isDeleteMode}
                  onDeleteClick={handleDeleteItemClick}
                  onEditClick={handleOpenEditModal} // <<< Truyền hàm mở modal sửa
                />
            ))
        )}
      </div>

      {/* Add Notification Form Modal */}
      <StatusModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Thêm thông báo mới"
      >
         {/* Hiển thị lỗi nếu có */}
         {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {/* ... (Form thêm giữ nguyên) ... */}
         <form onSubmit={handleAddFormSubmit} className="space-y-4">
           {/* Thông báo ID (Tự động tăng, không cần input này cho POST) */}
          {/* <div>
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
          </div> */}
          {/* Người nhận */}
          <div>
            <label htmlFor="add-recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Người nhận (apartment_id)
            </label>
            <input
              type="text"
              id="add-recipient"
              value={addRecipient}
              onChange={(e) => setAddRecipient(e.target.value)}
              placeholder="Ví dụ: P.713 hoặc All"
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

      {/* --- MODAL CHỈNH SỬA --- */}
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
                Người nhận (apartment_id)
              </label>
              <input
                type="text"
                id="edit-recipient"
                name="recipient" 
                value={editFormData.recipient}
                onChange={handleEditFormChange}
                placeholder="Ví dụ: P.713 hoặc All"
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
                name="content" 
                rows="4"
                value={editFormData.content}
                onChange={handleEditFormChange}
                placeholder="Enter here"
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