import React, { useState } from "react"; // <<< 1. Import useState
// Đảm bảo đường dẫn này đúng với vị trí file của bạn
import EditButtonImage from "../images/edit_button.svg";

// --- Icons (from heroicons.com) ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

// --- 2. TẠO COMPONENT TRƯỜNG CÓ THỂ CHỈNH SỬA ---
// Component này sẽ hiển thị input khi isEditing={true} và hiển thị text khi false
const EditableField = ({ label, value, isEditing, onChange, name }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-500 mb-1"
    >
      {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 min-h-[46px] focus:border-blue-500 focus:ring-blue-500"
      />
    ) : (
      <div className="w-full bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 min-h-[46px]">
        {value}
      </div>
    )}
  </div>
);

// --- Dữ liệu mẫu ban đầu ---
const initialUserData = {
  name: "Đỗ Văn B",
  residentId: "0002",
  role: "Cư dân", // Empty as in image
  apartment: "Tầng 7 - Phòng 713",
  cccd: "077204000123",
  dob: "30/10/1999",
  email: "dovanb@gmail.com",
  phone: "0938 099 203",
  status: "người thuê",
};

// --- Main Profile Page Component ---
export const ProfilePage = () => {
  // --- 3. THÊM STATE ĐỂ QUẢN LÝ CHẾ ĐỘ EDIT VÀ DỮ LIỆU FORM ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);

  // Hàm xử lý khi nhấn nút Edit
  const handleEditClick = () => {
    setIsEditing(true); // Bật chế độ chỉnh sửa
  };

  // Hàm xử lý khi thay đổi nội dung input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm xử lý khi nhấn nút Confirm
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form submit lại trang
    console.log("Dữ liệu đã cập nhật:", formData);
    // Ở đây bạn có thể gọi API để lưu dữ liệu
    // ...
    // Sau khi lưu xong, tắt chế độ chỉnh sửa
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-6xl mx-auto">
      {/* Card Header: Title + Edit Button */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Thông tin cá nhân
        </h1>
        {/* --- 4. ẨN NÚT EDIT KHI ĐANG Ở CHẾ ĐỘ CHỈNH SỬA --- */}
        {!isEditing && (
          <button
            onClick={handleEditClick} // Thêm onClick handler
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Chỉnh sửa thông tin"
          >
            <img src={EditButtonImage} alt="Edit" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Profile Header: Avatar + Name */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
          <UserIcon />
        </div>
        <div>
          {/* --- 5. SỬ DỤNG DỮ LIỆU TỪ STATE --- */}
          <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
          <p className="text-sm text-gray-600">
            ID Cư dân: {formData.residentId}
          </p>
        </div>
      </div>

      {/* --- 6. Thêm onSubmit cho form --- */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Section 1: Thông tin cá nhân */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin cá nhân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* --- 7. THAY THẾ InfoField BẰNG EditableField --- */}
            <EditableField
              label="Vai trò"
              name="role"
              value={formData.role}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <EditableField
              label="Số căn hộ"
              name="apartment"
              value={formData.apartment}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <EditableField
              label="Số CCCD"
              name="cccd"
              value={formData.cccd}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <EditableField
              label="Ngày sinh"
              name="dob"
              value={formData.dob}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 2: Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin liên hệ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <EditableField
              label="Email"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <EditableField
              label="Điện thoại"
              name="phone"
              value={formData.phone}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 3: Tình trạng cư trú */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tình trạng cư trú
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <EditableField
              label="Tình trạng cư trú"
              name="status"
              value={formData.status}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* --- 8. THÊM NÚT CONFIRM (chỉ hiển thị khi isEditing={true}) --- */}
        {isEditing && (
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors"
            >
              Confirm
            </button>
          </div>
        )}
      </form>
    </div>
  );
};