import React, { useState, useEffect } from 'react';

// Giả định bạn có component Modal để sử dụng lại cho việc Thêm/Sửa
// Nếu chưa có, bạn có thể tự thay thế bằng một div cố định.
const ResidentFormModal = ({ isOpen, onClose, residentData, onSave, isViewing = false }) => { // <<< THÊM isViewing
    const isEditing = !!residentData && !isViewing; // Không phải Editing nếu đang Viewing
    
    // Nếu ở chế độ xem, ta không cần tracking form data thay đổi, nhưng cần data ban đầu
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        apartment_id: '',
        email: '',
        role: 'Cư dân',
        residency_status: 'chủ hộ',
        cccd: '',
        birth_date: '',
        state: 'active', // Mặc định là active khi tạo mới
        ...(residentData || {})
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (residentData) {
            // Chuẩn bị dữ liệu cho form
            setFormData({
                ...residentData,
                // Định dạng ngày tháng cho input type="date"
                birth_date: residentData.birth_date ? new Date(residentData.birth_date).toISOString().split('T')[0] : '',
            });
        } else {
            // Reset form khi tạo mới
            setFormData({ first_name: '', last_name: '', phone: '', apartment_id: '', email: '', role: 'Cư dân', residency_status: 'người thuê', cccd: '', birth_date: '', state: 'active' });
        }
        setError(''); // Reset lỗi khi mở modal
    }, [residentData, isOpen, isViewing]);


    const handleChange = (e) => {
        if (isViewing) return; // Không cho phép thay đổi khi xem
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewing) return; // Ngăn không cho submit khi xem
        setError('');

        // Kiểm tra trường bắt buộc (theo BE/app.js)
        if (!formData.first_name || !formData.last_name || !formData.phone || !formData.apartment_id) {
            setError('Vui lòng điền đủ Họ, Tên, Số điện thoại và Mã căn hộ.');
            return;
        }

        const url = isEditing ? `/api/residents/${formData.id}` : '/api/residents';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Lỗi từ server (ví dụ: duplicate phone, validation error)
                throw new Error(result.error || `Lỗi ${isEditing ? 'cập nhật' : 'thêm mới'} cư dân.`);
            }

            // Gọi hàm onSave trong component cha để cập nhật danh sách
            onSave(result);
            onClose();

        } catch (err) {
            console.error('API Error:', err);
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    // Xác định title cho Modal
    const modalTitle = isViewing ? 'Chi tiết Cư dân' : (isEditing ? 'Chỉnh sửa Cư dân' : 'Thêm Cư dân mới');

    // Thuộc tính readOnly cho input
    const readOnlyProp = isViewing ? { readOnly: true } : {};


    return (
        // Giao diện Modal Sáng
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl text-gray-900"> {/* Nền trắng, chữ đen */}
                <h2 className="text-xl font-bold mb-4">{modalTitle}</h2> {/* <<< Dùng modalTitle */}
                {/* Chỉ hiện lỗi khi KHÔNG ở chế độ xem */}
                {error && !isViewing && <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">{error}</div>}
                
                {/* Ở chế độ xem, ta vẫn dùng form để tránh thay đổi quá nhiều cấu trúc, nhưng ngăn chặn submit */}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Hàng 1: First Name / Last Name */}
                    <InputGroup label="Tên (First Name)" name="first_name" value={formData.first_name} onChange={handleChange} required readOnly={isViewing} /> {/* <<< THÊM readOnly */}
                    <InputGroup label="Họ (Last Name)" name="last_name" value={formData.last_name} onChange={handleChange} required readOnly={isViewing} />

                    {/* Hàng 2: Phone / Apartment ID */}
                    <InputGroup label="Số điện thoại" name="phone" type="tel" value={formData.phone} onChange={handleChange} required readOnly={isViewing} />
                    <InputGroup label="Mã căn hộ" name="apartment_id" value={formData.apartment_id} onChange={handleChange} required readOnly={isViewing} />
                    
                    {/* Hàng 3: Email / CCCD */}
                    <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleChange} readOnly={isViewing} />
                    <InputGroup label="CCCD" name="cccd" value={formData.cccd} onChange={handleChange} readOnly={isViewing} />

                    {/* Hàng 4: Ngày sinh / Trạng thái cư trú */}
                    <InputGroup label="Ngày sinh" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} readOnly={isViewing} />
                    <SelectGroup 
                        label="Trạng thái cư trú" 
                        name="residency_status" 
                        value={formData.residency_status} 
                        onChange={handleChange}
                        options={['chủ hộ', 'người thuê', 'khách tạm trú']}
                        disabled={isViewing} // <<< THÊM disabled
                    />
                    
                    {/* Hàng 5: Vai trò / Trạng thái */}
                    <SelectGroup 
                        label="Vai trò" 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange}
                        options={['Quản lý', 'Cư dân']}
                        disabled={isViewing}
                    />
                    {/* Luôn hiện trạng thái, nhưng chỉ cho chỉnh sửa khi là editing */}
                    <SelectGroup 
                        label="Trạng thái" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange}
                        options={['active', 'inactive']}
                        disabled={isViewing || !isEditing} // <<< THÊM disabled
                    />

                    <div className="col-span-2 flex justify-end space-x-4 mt-6">
                        {/* Nút Đóng/Hủy (luôn hiện) */}
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors">
                            {isViewing ? 'Đóng' : 'Hủy'} {/* Đổi text thành Đóng khi xem */}
                        </button>
                        
                        {/* Nút Xác nhận/Thêm mới (Chỉ hiện khi KHÔNG ở chế độ xem) */}
                        {!isViewing && (
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">
                                {isEditing ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

// Component Helper cho Input (Giao diện Sáng)
// Cập nhật để chấp nhận readOnly prop
const InputGroup = ({ label, name, value, onChange, type = 'text', required = false, readOnly = false }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required && !readOnly} // Nếu là readOnly thì không bắt buộc
            readOnly={readOnly} // <<< THÊM readOnly
            className={`p-2 border border-gray-300 rounded text-sm focus:outline-none ${
                readOnly 
                    ? 'bg-gray-100 text-gray-600 cursor-default' // Style khi readOnly
                    : 'bg-white text-gray-900 focus:border-blue-500' // Style khi có thể chỉnh sửa
            }`}
        />
    </div>
);

// Component Helper cho Select (Giao diện Sáng)
// Cập nhật để chấp nhận disabled prop
const SelectGroup = ({ label, name, value, onChange, options, disabled = false }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <select
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled} // <<< THÊM disabled
            className={`p-2 border border-gray-300 rounded text-sm focus:outline-none ${
                disabled
                    ? 'bg-gray-100 text-gray-600 cursor-default' // Style khi disabled
                    : 'bg-white text-gray-900 focus:border-blue-500' // Style khi có thể chỉnh sửa
            }`}
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);


// =========================================================================
// == COMPONENT CHÍNH: RESIDENTSPAGE ==
// =========================================================================
export const ResidentsPage = () => {
    const [residents, setResidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // --- State cho Modal Thêm/Sửa ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);
    
    // --- State MỚI cho Modal Chi tiết/Xem ---
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // <<< THÊM
    const [viewingResident, setViewingResident] = useState(null); // <<< THÊM

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState(null);

    // --- READ (Đọc danh sách cư dân) ---
    const fetchResidents = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/residents'); 
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu cư dân.');
            }
            const data = await response.json();
            setResidents(data);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    // --- CREATE / UPDATE (Thêm/Sửa) ---
    const handleAddClick = () => {
        setEditingResident(null); 
        setIsModalOpen(true);
    };

    const handleEditClick = (resident) => {
        setEditingResident(resident); 
        setIsModalOpen(true);
    };
    
    // --- VIEW (Xem chi tiết) ---
    const handleViewClick = (resident) => { // <<< HÀM MỚI
        setViewingResident(resident); 
        setIsViewModalOpen(true);
    };

    const handleSave = () => {
        fetchResidents();
    };

    // --- DELETE (Xóa mềm - soft delete) ---
    // const handleDeleteClick = (resident) => {
    //     setResidentToDelete(resident);
    //     setIsConfirmModalOpen(true);
    // };

    const confirmDelete = async () => {
        if (!residentToDelete) return;

        try {
            const response = await fetch(`/api/residents/${residentToDelete.id}`, {
                method: 'DELETE', // API của bạn thực hiện soft delete
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi xóa cư dân.');
            }

            fetchResidents();

        } catch (err) {
            console.error('Delete Error:', err);
            setError(err.message);
        } finally {
            setIsConfirmModalOpen(false);
            setResidentToDelete(null);
        }
    };


    if (isLoading) {
        return <div className="p-8 text-white text-lg bg-blue-700 min-h-screen">Đang tải dữ liệu cư dân...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-100 text-lg bg-blue-700 min-h-screen">Lỗi tải dữ liệu: {error}</div>;
    }

    return (
        <div className="flex-1 p-8 bg-blue-700 min-h-screen text-white"> {/* Nền xanh dương sáng */}
            
            {/* Thanh Search/Filter đã bị xóa */}

            <h1 className="text-3xl font-bold mb-6">Thông tin cư dân</h1>

            {/* Header: Nút Thêm/Xóa */}
            <div className="flex justify-end gap-4 mb-8">
                {/* Nút Thêm */}
                <button
                    onClick={handleAddClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center text-sm" // Màu xanh dương, text nhỏ hơn
                >
                    Thêm cư dân
                </button>
                {/* Nút Xóa */}
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center text-sm" // Màu đỏ, text nhỏ hơn
                >
                    Xóa cư dân
                </button>
            </div>

            {/* Danh sách thẻ cư dân */}
            <div className="space-y-4"> {/* Khoảng cách dọc giữa các thẻ */}
                {residents.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg text-center text-gray-500"> {/* Nền thẻ trắng */}
                        Không có cư dân nào để hiển thị.
                    </div>
                ) : (
                    residents.map((resident) => (
                        // Thẻ thông tin cư dân (Giao diện Sáng)
                        <div key={resident.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-6 relative text-gray-900"> {/* Nền trắng, chữ đen */}
                            {/* Icon User */}
                            <div className="bg-gray-100 p-3 rounded-full flex-shrink-0"> {/* Nền icon xám nhạt */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Màu icon xám */}
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>

                            {/* Khối thông tin 5 cột */}
                            <div className="flex-grow grid grid-cols-5 gap-x-8 items-center text-sm"> {/* Tăng gap-x */}
                                {/* Cột 1: Họ và Tên */}
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs mb-1">Họ và tên</span> {/* Màu label xám */}
                                    <span className="font-semibold text-gray-900 truncate text-sm" title={resident.full_name}>{resident.full_name}</span> {/* Chữ đen */}
                                </div>
                                
                                {/* Cột 2: ID Dân cư (THAY ĐỔI TỪ SĐT) */}
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs mb-1">ID Dân cư</span>
                                    <span className="font-semibold text-gray-900 text-sm">{resident.id}</span> {/* Hiển thị ID */}
                                </div>
                                
                                {/* Cột 3: Ngày sinh */}
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs mb-1">Ngày sinh</span>
                                    <span className="font-semibold text-gray-900 text-sm"> {/* Chữ đen */}
                                        {resident.birth_date ? new Date(resident.birth_date).toLocaleDateString('vi-VN') : '--/--/----'}
                                    </span>
                                </div>
                                
                                {/* Cột 4: Số căn hộ */}
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs mb-1">Số căn hộ</span>
                                    <span className="font-semibold text-gray-900 text-sm">{resident.apartment_id}</span> {/* Chữ đen */}
                                </div>
                                
                                {/* Cột 5: Thông tin chi tiết */}
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs mb-1">Thông tin chi tiết</span>
                                    {/* <<< THAY NÚT XEM THÊM THÀNH GỌI handleViewClick */}
                                    <button 
                                        onClick={() => handleViewClick(resident)}
                                        className="text-blue-500 hover:underline text-left text-sm p-0 bg-transparent border-none font-semibold">
                                        Xem thêm
                                    </button>
                                </div>
                            </div>

                             {/* Nút Chỉnh sửa */}
                            <button
                                onClick={() => handleEditClick(resident)}
                                className="ml-auto flex-shrink-0 text-blue-500 hover:text-blue-700 font-semibold py-1 px-3 rounded-md transition-colors text-sm bg-transparent border-none" // Màu text xanh dương
                            >
                                Chỉnh sửa
                            </button>

                            {/* Trạng thái "Đã xóa" */}
                            {resident.state === 'inactive' && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
                                    Đã xóa
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <ResidentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                residentData={editingResident}
                onSave={handleSave}
                isViewing={false} // <<< Chế độ sửa/thêm
            />
            
            {/* --- MODAL XEM CHI TIẾT MỚI --- */}
            <ResidentFormModal
                isOpen={isViewModalOpen} // <<< Dùng state mới
                onClose={() => setIsViewModalOpen(false)} // <<< Dùng state mới
                residentData={viewingResident} // <<< Dùng state mới
                onSave={() => {}} // Không cần hàm save
                isViewing={true} // <<< CHẾ ĐỘ CHỈ XEM
            />
            {/* ----------------------------- */}

            {isConfirmModalOpen && residentToDelete && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    {/* ... Confirmation Modal content (Nên đổi sang giao diện sáng nếu cần) ... */}
                 </div>
             )}
        </div>
    );
};