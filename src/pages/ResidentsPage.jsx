import React, { useState } from "react";

// --- Import Modals và Icons ---
import { StatusModal } from "../layouts/StatusModal";
import { ConfirmationModal } from "../layouts/ConfirmationModal"; // <<< THÊM ConfirmationModal
import acceptIcon from "../images/accept_icon.png";
import notAcceptIcon from "../images/not_accept_icon.png";

// --- Icons ---
const UserCircleIcon = () => (
 // ... (SVG code giữ nguyên)
 <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);


// --- Dữ liệu mẫu ban đầu ---
const initialResidentData = [
 // ... (dữ liệu giữ nguyên)
  {
    id: "0001",
    name: "A",
    dob: "01/01/2005",
    apartment: "712",
  },
  {
    id: "0002",
    name: "B",
    dob: "01/01/2005",
    apartment: "712",
  },
  {
    id: "0003",
    name: "C",
    dob: "01/01/2005",
    apartment: "712",
  },
  {
    id: "0004",
    name: "D",
    dob: "01/01/2005",
    apartment: "712",
  },
  {
    id: "0005",
    name: "E",
    dob: "01/01/2005",
    apartment: "712",
  },
];


// --- 1. Cập nhật ResidentItem để nhận thêm prop isDeleteMode và onDeleteClick ---
const ResidentItem = ({ resident, onEditClick, isDeleteMode, onDeleteClick }) => {
  const handleViewDetails = (id) => {
    console.log(`Viewing details for resident ID: ${id}`);
  };

  const handleActionClick = () => {
    if (isDeleteMode) {
      onDeleteClick(resident); // Gọi hàm xóa nếu đang ở chế độ xóa
    } else {
      onEditClick(resident); // Gọi hàm sửa nếu không ở chế độ xóa
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center space-x-6 relative overflow-hidden mb-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <UserCircleIcon />
      </div>

      {/* Thông tin chính */}
      <div className="flex-1 grid grid-cols-6 gap-4 items-center text-sm">
        {/* ... (Các cột Họ tên, ID, Ngày sinh, Căn hộ giữ nguyên) ... */}
         {/* Họ và tên */}
         <div className="col-span-1">
          <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
          <p className="font-semibold text-gray-800">{resident.name}</p>
        </div>
        {/* ID Dân cư */}
        <div className="col-span-1 text-center">
          <p className="text-xs text-gray-500 mb-1">ID Dân cư</p>
          <p className="font-medium text-gray-700">{resident.id}</p>
        </div>
        {/* Ngày sinh */}
        <div className="col-span-1 text-center">
          <p className="text-xs text-gray-500 mb-1">Ngày sinh</p>
          <p className="text-gray-600">{resident.dob}</p>
        </div>
        {/* Số căn hộ */}
        <div className="col-span-1 text-center">
          <p className="text-xs text-gray-500 mb-1">Số căn hộ</p>
          <p className="text-gray-600">{resident.apartment}</p>
        </div>

        {/* Thông tin chi tiết */}
        <div className="col-span-1 text-center">
          <p className="text-xs text-gray-500 mb-1">Thông tin chi tiết</p>
          <button
            onClick={() => handleViewDetails(resident.id)}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Xem thêm
          </button>
        </div>

        {/* Nút hành động (Chỉnh sửa / Xóa cư dân) */}
        <div className="col-span-1 text-right">
          <button
            onClick={handleActionClick} // Gọi hàm xử lý chung
            className={`${
              isDeleteMode // Thay đổi màu sắc và text dựa trên chế độ
                ? "text-red-600 hover:text-red-800"
                : "text-blue-600 hover:text-blue-800"
            } hover:underline font-medium`}
          >
            {isDeleteMode ? "Xóa cư dân" : "Chỉnh sửa"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Component Trang Dân cư chính ---
export const ResidentsPage = () => {
  const [residents, setResidents] = useState(initialResidentData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', dob: '', apartment: '' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({ id: '', name: '', dob: '', apartment: '' });

  // --- 2. THÊM STATE CHO CHẾ ĐỘ XÓA VÀ MODAL XÁC NHẬN ---
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null); // Lưu trữ cư dân sắp bị xóa

  // State cho modal thông báo
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null); // 'editSuccess', 'editFailure', 'addSuccess', 'addFailure', 'deleteSuccess', 'deleteFailure'
  const [statusMessage, setStatusMessage] = useState("");

  // --- HÀM CHO MODAL CHỈNH SỬA (giữ nguyên) ---
  // ... (handleOpenEditModal, handleCloseEditModal, handleEditFormChange, handleEditSubmit)
   const handleOpenEditModal = (resident) => {
    setEditingResident(resident);
    setEditFormData({ name: resident.name, dob: resident.dob, apartment: resident.apartment });
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingResident(null);
    setEditFormData({ name: '', dob: '', apartment: '' });
  };
   const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({ ...prevData, [name]: value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingResident) return;
    console.log("Submitting edit for resident ID:", editingResident.id, "Data:", editFormData);
    const isSuccess = Math.random() > 0.3;
    handleCloseEditModal();
    if (isSuccess) {
      setResidents(prevResidents =>
        prevResidents.map(res =>
          res.id === editingResident.id ? { ...res, ...editFormData } : res
        )
      );
      setModalStatus("editSuccess");
      setStatusMessage("Chỉnh sửa thông tin cư dân thành công!");
    } else {
      setModalStatus("editFailure");
      setStatusMessage("Chỉnh sửa thông tin cư dân không thành công!");
    }
    setIsStatusModalOpen(true);
  };


  // --- HÀM CHO MODAL THÊM MỚI (giữ nguyên) ---
  // ... (handleOpenAddModal, handleCloseAddModal, handleAddFormChange, handleAddSubmit)
   const handleOpenAddModal = () => {
    setAddFormData({ id: '', name: '', dob: '', apartment: '' }); // Reset form trước khi mở
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    // Không cần reset form ở đây vì đã reset lúc mở
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    // Validate ID uniqueness (optional but recommended)
    if (residents.some(res => res.id === addFormData.id)) {
        alert("ID Cư dân đã tồn tại!");
        return;
    }

    console.log("Submitting new resident:", addFormData);

    // --- Giả lập gọi API ---
    const isSuccess = Math.random() > 0.3; // 70% thành công
    // ----------------------

    handleCloseAddModal(); // Đóng modal thêm

    if (isSuccess) {
      // Thêm cư dân mới vào state
      const newResident = { ...addFormData }; // Tạo bản sao
      setResidents(prevResidents => [...prevResidents, newResident]);

      setModalStatus("addSuccess");
      setStatusMessage("Thêm cư dân mới thành công!");
    } else {
      setModalStatus("addFailure");
      setStatusMessage("Thêm cư dân mới không thành công!");
    }
    setIsStatusModalOpen(true); // Mở modal thông báo
  };

  // --- 3. THÊM CÁC HÀM XỬ LÝ XÓA ---
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode); // Bật/tắt chế độ xóa
  };

  // Được gọi từ ResidentItem khi nhấn "Xóa cư dân"
  const handleDeleteRequest = (resident) => {
    setResidentToDelete(resident); // Lưu thông tin cư dân cần xóa
    setShowConfirmDeleteModal(true); // Mở modal xác nhận
  };

  // Đóng modal xác nhận
  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setResidentToDelete(null);
  };

  // Xử lý khi nhấn Confirm trong modal xác nhận xóa
  const handleConfirmDelete = () => {
    if (!residentToDelete) return;

    console.log(`Confirming delete for resident ID: ${residentToDelete.id}`);
    setShowConfirmDeleteModal(false); // Đóng modal xác nhận

    // --- GIẢ LẬP API XÓA ---
    const isSuccess = Math.random() > 0.3; // 70% thành công
    // ----------------------

    if (isSuccess) {
      // Cập nhật state nếu xóa thành công
      setResidents(prevResidents =>
        prevResidents.filter(res => res.id !== residentToDelete.id) // Lọc bỏ cư dân đã xóa
      );
      setModalStatus("deleteSuccess");
      setStatusMessage("Đã xóa cư dân thành công!");
    } else {
      setModalStatus("deleteFailure");
      setStatusMessage("Xóa cư dân không thành công!");
    }
    setIsStatusModalOpen(true); // Mở modal thông báo
    setResidentToDelete(null); // Reset cư dân cần xóa
    // Tùy chọn: Tự động tắt delete mode sau khi xóa?
    // setIsDeleteMode(false);
  };

  // --- HÀM ĐÓNG/RENDER MODAL THÔNG BÁO (giữ nguyên) ---
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Thông tin cư dân</h1>
        <div className="flex items-center space-x-4">
          {/* Chỉ hiển thị nút Thêm khi không ở chế độ xóa */}
          {!isDeleteMode && (
            <button
              onClick={handleOpenAddModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              + Thêm cư dân
            </button>
          )}
          {/* Nút Xóa / Hoàn tất */}
          <button
            onClick={toggleDeleteMode} // Bật/tắt chế độ xóa
            className={`${
              isDeleteMode // Style dựa trên chế độ xóa
                ? "bg-gray-500 hover:bg-gray-600" // Style "Hoàn tất"
                : "bg-red-500 hover:bg-red-600" // Style "Xóa cư dân"
            } text-white font-semibold py-2 px-4 rounded-md transition-colors`}
          >
            {isDeleteMode ? "Hoàn tất" : "Xóa cư dân"}
          </button>
        </div>
      </div>

      {/* Danh sách cư dân */}
      <div className="space-y-4">
        {residents.map((resident) => (
          <ResidentItem
            key={resident.id}
            resident={resident}
            onEditClick={handleOpenEditModal}
            isDeleteMode={isDeleteMode} // <<< Truyền state chế độ xóa
            onDeleteClick={handleDeleteRequest} // <<< Truyền hàm xử lý yêu cầu xóa
          />
        ))}
      </div>

      {/* --- MODAL CHỈNH SỬA (giữ nguyên) --- */}
      <StatusModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Chỉnh sửa thông tin cư dân"
      >
        {/* ... (Form chỉnh sửa giữ nguyên) ... */}
         {editingResident && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Cư dân ID (Chỉ hiển thị) */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Cư dân ID
              </label>
              <div className="w-full bg-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 min-h-[46px]">
                {editingResident.id}
              </div>
            </div>
             {/* Họ và tên */}
             <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                placeholder="Enter here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label htmlFor="edit-dob" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="text" // Có thể đổi thành type="date"
                id="edit-dob"
                name="dob"
                value={editFormData.dob}
                onChange={handleEditFormChange}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            {/* Số căn hộ */}
            <div>
              <label htmlFor="edit-apartment" className="block text-sm font-medium text-gray-700 mb-1">
                Số căn hộ
              </label>
              <input
                type="text"
                id="edit-apartment"
                name="apartment"
                value={editFormData.apartment}
                onChange={handleEditFormChange}
                placeholder="Enter here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
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

      {/* --- MODAL THÊM MỚI (giữ nguyên) --- */}
      <StatusModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Thêm cư dân mới"
      >
        {/* ... (Form thêm mới giữ nguyên) ... */}
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* Cư dân ID */}
          <div>
            <label htmlFor="add-id" className="block text-sm font-medium text-gray-700 mb-1">
              Cư dân ID
            </label>
            <input
              type="text"
              id="add-id"
              name="id" // Phải khớp với key trong addFormData
              value={addFormData.id}
              onChange={handleAddFormChange}
              placeholder="Nhập ID cư dân"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Họ và tên */}
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              id="add-name"
              name="name"
              value={addFormData.name}
              onChange={handleAddFormChange}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label htmlFor="add-dob" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="text"
              id="add-dob"
              name="dob"
              value={addFormData.dob}
              onChange={handleAddFormChange}
              placeholder="DD/MM/YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Số căn hộ */}
          <div>
            <label htmlFor="add-apartment" className="block text-sm font-medium text-gray-700 mb-1">
              Số căn hộ
            </label>
            <input
              type="text"
              id="add-apartment"
              name="apartment"
              value={addFormData.apartment}
              onChange={handleAddFormChange}
              placeholder="Enter here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Nút Add */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              Add {/* Đổi tên nút thành Add */}
            </button>
          </div>
        </form>
      </StatusModal>

      {/* --- 4. THÊM MODAL XÁC NHẬN XÓA --- */}
      <ConfirmationModal
        isOpen={showConfirmDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Chú ý: Xóa cư dân!!!"
        message={`Bạn có chắc chắn muốn xóa cư dân ${residentToDelete?.name || ''} (ID: ${residentToDelete?.id || ''}) không?`}
      />

       {/* --- MODAL THÔNG BÁO (giữ nguyên) --- */}
       <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
       >
        {renderStatusModalContent()}
       </StatusModal>
    </div>
  );
};