import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import axiosClient from '../../api/axios';
import { 
    FileEdit, UploadCloud, ChevronDown, AlertTriangle, Bold, Italic, 
    List, Link as LinkIcon, Code, GripVertical, Plus, 
    Users, ChevronRight, Lock, Rocket, EyeOff, FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstructorCourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNewCourse = id === 'new';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        category: 'Web Development',
        image: '',
        trang_thai: 'DRAFT',
        file_anh_that: null
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [studentCount, setStudentCount] = useState(0); // State lưu số học viên thật
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            if (!isNewCourse) {
                try {
                    const response = await axiosClient.get(`/courses/${id}`);
                    const courseData = response.data.data || response.data;
                    
                    setFormData({
                        title: courseData.ten_khoa_hoc || '',
                        description: courseData.mo_ta || '',
                        price: courseData.gia || 0,
                        category: courseData.id_danh_muc === 1 ? 'Web Development' : 'Data Science',
                        trang_thai: courseData.trang_thai || 'DRAFT',
                        hinh_anh: courseData.hinh_anh || ''
                    });

                    // Cập nhật preview ảnh cũ và số lượng học viên
                    if (courseData.hinh_anh) setImagePreview(courseData.hinh_anh);
                    setStudentCount(courseData.studentCount || 0);

                    const lessonsResponse = await axiosClient.get(`/courses/${id}/lessons`);
                    setLessons(lessonsResponse.data.data || []);

                } catch (error) {
                    console.error('Lỗi khi tải thông tin:', error);
                }
            }
        };
        fetchCourseDetail();
    }, [id, isNewCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'title') setErrorText('');
    };

    // LOGIC LƯU KHÓA HỌC KÈM ẢNH (DÙNG FORMDATA)
    const handleSave = async () => {
        if (!formData.title.trim()) {
            setErrorText('Tên khóa học không được để trống!');
            return;
        }

        try {
            const data = new FormData();
            data.append('ten_khoa_hoc', formData.title);
            data.append('mo_ta', formData.description);
            data.append('gia', formData.price);
            data.append('id_danh_muc', formData.category === 'Web Development' ? 1 : 2);

            // Gửi file ảnh nếu người dùng có chọn ảnh mới
            if (formData.file_anh_that) {
                data.append('image', formData.file_anh_that);
            }

            if (isNewCourse) {
                await axiosClient.post('/courses', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Tạo khóa học mới thành công!');
            } else {
                await axiosClient.put(`/courses/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Cập nhật thành công!');
            }
            navigate('/instructor/courses');
        } catch (error) {
            toast.error('Lỗi khi lưu khóa học! Hãy kiểm tra dữ liệu.');
        }
    };

    const confirmDelete = async () => {
        setIsDeleteModalOpen(false);
        try {
            await axiosClient.delete(`/courses/${id}`);
            toast.success('Đã xử lý thành công!');
            navigate('/instructor/courses');
        } catch (error) {
            toast.error('Lỗi: Không thể thực hiện yêu cầu!');
        }
    };

    return (
        <InstructorLayout>
            <div className="p-8 max-w-[1280px] mx-auto w-full text-[#101c2d]">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6B778C] mb-2">
                        <span className="cursor-pointer hover:text-[#0052CC]" onClick={() => navigate('/instructor/courses')}>Courses</span>
                        <ChevronRight size={14} />
                        <span className="text-[#172B4D]">Course Editor</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-[32px] font-bold text-[#172B4D] leading-[40px] tracking-tight">
                                {isNewCourse ? 'Tạo khóa học mới' : formData.title || 'Đang tải...'}
                            </h2>
                            <p className="text-[16px] text-[#6B778C] mt-1">Thiết lập chương trình học, giá cả và hiển thị.</p>
                        </div>
                        <div className="flex gap-3">
                            {!isNewCourse && (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="px-6 py-2 border border-red-200 text-red-600 rounded-lg text-[14px] font-semibold hover:bg-red-50 transition-colors">
                                    Xóa
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/instructor/courses')}
                                className="px-6 py-2 border border-[#DFE1E6] rounded-lg text-[14px] font-semibold text-[#172B4D] hover:bg-[#F4F5F7] transition-colors">
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-[#0052CC] text-white rounded-lg text-[14px] font-semibold shadow-lg shadow-[#0052CC]/20 hover:opacity-90 transition-opacity">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-8 space-y-6">
                        
                        {/* Basic Info Card */}
                        <section className="bg-white border border-[#DFE1E6] rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#F4F5F7]">
                                <FileEdit className="text-[#0052CC]" size={20} />
                                <h3 className="text-[20px] font-semibold text-[#172B4D]">Thông tin cơ bản</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#172B4D] mb-2">Tên khóa học</label>
                                    <input 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errorText ? 'border-[#ba1a1a]' : 'border-[#DFE1E6]'} rounded-lg focus:ring-2 focus:ring-[#0052CC] outline-none text-[16px]`} 
                                        placeholder="Nhập tên khóa học" 
                                    />
                                    {errorText && <p className="text-[#ba1a1a] text-sm mt-1">{errorText}</p>}
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#172B4D] mb-2">Mô tả khóa học</label>
                                    <div className="border border-[#DFE1E6] rounded-lg overflow-hidden">
                                        <div className="bg-[#F4F5F7] px-4 py-2 flex gap-4 border-b border-[#DFE1E6]">
                                            <button className="text-[#6B778C] hover:text-[#0052CC]"><Bold size={16} /></button>
                                            <button className="text-[#6B778C] hover:text-[#0052CC]"><Italic size={16} /></button>
                                            <button className="text-[#6B778C] hover:text-[#0052CC]"><List size={16} /></button>
                                            <button className="text-[#6B778C] hover:text-[#0052CC]"><LinkIcon size={16} /></button>
                                            <button className="text-[#6B778C] hover:text-[#0052CC]"><Code size={16} /></button>
                                        </div>
                                        <textarea 
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-none focus:ring-0 text-[14px] leading-relaxed outline-none" 
                                            rows="8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Curriculum Snapshot */}
                        {!isNewCourse && (
                            <section className="bg-white border border-[#DFE1E6] rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#F4F5F7]">
                                    <div className="flex items-center gap-2">
                                        <List className="text-[#0052CC]" size={20} />
                                        <h3 className="text-[20px] font-semibold text-[#172B4D]">Chương trình học</h3>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/instructor/courses/${id}/lessons/new`)}
                                        className="text-[#0052CC] text-[14px] font-semibold flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={16} /> Thêm bài học
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {lessons.length > 0 ? (
                                        lessons.map((lesson, index) => (
                                            <div key={lesson.id} className="flex items-center gap-4 p-4 border border-[#DFE1E6] rounded-lg bg-white hover:bg-[#F0F5FF] transition-colors group cursor-move">
                                                <GripVertical className="text-[#6B778C]" size={20} />
                                                <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-xs font-bold text-slate-500">
                                                    {String(lesson.thu_tu).padStart(2, '0')} {/* Hiển thị 01, 02... */}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-[14px] font-semibold text-[#172B4D]">{lesson.tieu_de}</p>
                                                    {/* Có thể hiển thị thêm thời lượng video nếu muốn */}
                                                </div>
                                                <FileEdit className="text-[#6B778C] opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#0052CC]" size={18} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-6 border-2 border-dashed border-[#DFE1E6] rounded-lg bg-[#F4F5F7]">
                                            <p className="text-[13px] text-[#6B778C]">Khóa học này chưa có bài học nào.</p>
                                            <p className="text-[13px] text-[#6B778C]">Bấm "Thêm bài học" để bắt đầu xây dựng nội dung.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-12 md:col-span-4 space-y-6">
                        
                        {/* Khối Học Viên */}
                        {!isNewCourse && (
                            <a href="#" className="block bg-white border border-[#DFE1E6] rounded-xl p-6 shadow-sm hover:border-[#0052CC] hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="text-[#0052CC]" size={20} />
                                        <label className="block text-[14px] font-semibold text-[#172B4D]">Học viên đăng ký</label>
                                    </div>
                                    <span className="text-[#0052CC] text-[12px] font-semibold group-hover:underline flex items-center">
                                        Xem chi tiết <ChevronRight size={14} className="ml-0.5" />
                                    </span>
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-bold text-[#172B4D]">
                                        {studentCount.toLocaleString('vi-VN')}
                                    </span>
                                    <span className="text-[#6B778C] text-[14px] mb-1">học viên</span>
                                </div>
                                {studentCount > 0 ? (
                                    <div className="mt-4 flex -space-x-2">
                                        {studentCount >= 1 && <img alt="student 1" className="w-8 h-8 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Student+1&background=random" />}
                                        {studentCount >= 2 && <img alt="student 2" className="w-8 h-8 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Student+2&background=random" />}
                                        {studentCount > 2 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                +{studentCount - 2}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-4 text-[12px] text-[#6B778C] italic">Chưa có học viên nào mua khóa học này.</p>
                                )}
                            </a>
                        )}

                        {/* Media Card (ĐÃ ĐỒNG BỘ LOGIC ẢNH) */}
                        <section className="bg-white border border-[#DFE1E6] rounded-xl p-6 shadow-sm">
                            <label className="block text-[14px] font-semibold text-[#172B4D] mb-4">Hình ảnh khóa học</label>
                            <div 
                                onClick={() => document.getElementById('fileInput').click()}
                                className="relative group aspect-video bg-[#F4F5F7] rounded-lg border-2 border-dashed border-[#DFE1E6] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-[#0052CC] transition-colors">
                                
                                {imagePreview ? (
                                    <>
                                        <img 
                                            src={imagePreview} 
                                            alt="Course Preview" 
                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" 
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="relative z-10 flex flex-col items-center bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <UploadCloud className="text-[#0052CC] mb-2" size={24} />
                                            <p className="text-[12px] font-semibold text-[#172B4D]">Thay đổi hình ảnh</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative z-10 flex flex-col items-center p-4 rounded-xl">
                                        <UploadCloud className="text-[#0052CC] mb-2" size={32} />
                                        <p className="text-[12px] font-semibold text-[#172B4D]">Nhấn để tải ảnh lên</p>
                                        <p className="text-[10px] text-[#6B778C] mt-1">PNG, JPG (Tối đa 5MB)</p>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" id="fileInput" className="hidden" accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setImagePreview(reader.result);
                                        reader.readAsDataURL(file);
                                        setFormData({ ...formData, file_anh_that: file }); 
                                    }
                                }}
                            />
                        </section>

                        <section className="bg-white border border-[#DFE1E6] rounded-xl p-6 shadow-sm space-y-6">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#172B4D] mb-2">Giá khóa học</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#0052CC]">VNĐ</span>
                                    <input 
                                        name="price" type="number" value={formData.price} onChange={handleChange}
                                        className="w-full pl-16 pr-4 py-3 border border-[#DFE1E6] rounded-lg focus:ring-2 focus:ring-[#0052CC] outline-none text-[14px] font-semibold" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#172B4D] mb-2">Danh mục</label>
                                <div className="relative">
                                    <select 
                                        name="category" value={formData.category} onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#DFE1E6] rounded-lg appearance-none focus:ring-2 focus:ring-[#0052CC] outline-none text-[14px]">
                                        <option value="Web Development">Web Development</option>
                                        <option value="Data Science">Data Science</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B778C]" size={16} />
                                </div>
                            </div>
                            
                            {!isNewCourse && (
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#172B4D] mb-2">Giảng viên phụ trách</label>
                                    <div className="flex items-center gap-3 p-3 bg-[#F4F5F7] rounded-lg border border-[#DFE1E6]">
                                        <img alt="Instructor Profile" className="w-8 h-8 rounded-full" src="https://ui-avatars.com/api/?name=Giang+Vien&background=0D8ABC&color=fff" />
                                        <div>
                                            <p className="text-[14px] font-semibold text-[#172B4D]">Tài khoản của bạn</p>
                                            <p className="text-[10px] text-[#6B778C] font-bold uppercase">Người tạo khóa học</p>
                                        </div>
                                        <Lock size={16} className="ml-auto text-[#6B778C]" />
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Status Chip */}
                        {!isNewCourse && (
                            <section className="bg-[#F0F5FF] border border-[#0052CC]/20 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-[#0052CC] tracking-widest mb-1">Trạng thái hiện tại</p>
                                        <h4 className="text-[20px] font-semibold text-[#003d9b]">
                                            {formData.trang_thai === 'PUBLISHED' ? 'Đang phát hành' : 
                                             formData.trang_thai === 'HIDDEN' ? 'Đã ẩn' : 'Bản nháp'}
                                        </h4>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
                                        {formData.trang_thai === 'PUBLISHED' ? (
                                            <Rocket className="text-[#0052CC]" size={24} />
                                        ) : formData.trang_thai === 'HIDDEN' ? (
                                            <EyeOff className="text-[#0052CC]" size={24} />
                                        ) : (
                                            <FileText className="text-[#0052CC]" size={24} />
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertTriangle size={28} />
                            <h3 className="text-xl font-bold">Cảnh báo xóa khóa học</h3>
                        </div>
                        <p className="text-[#434654] mb-6">
                            Bạn có chắc chắn muốn xóa khóa học này không? <br /><br />
                            <span className="font-semibold text-[#172B4D]">Lưu ý:</span> Nếu khóa học này <b>đã có người mua</b>, hệ thống sẽ tự động chuyển sang trạng thái <b>ẨN</b> thay vì xóa hoàn toàn.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-5 py-2 font-semibold text-[#6B778C] hover:bg-slate-100 rounded-lg transition-colors">
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg transition-colors">
                                Tiếp tục xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
}