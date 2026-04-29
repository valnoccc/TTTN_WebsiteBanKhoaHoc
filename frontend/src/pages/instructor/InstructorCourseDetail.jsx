import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import axiosClient from '../../api/axios';
import { FileEdit, UploadCloud, ChevronDown, AlertTriangle, Bold, Italic, List, Link as LinkIcon, Code, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
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
                        hinh_anh: courseData.hinh_anh || '',
                    });
                    if (courseData.hinh_anh) setImagePreview(courseData.hinh_anh);
                } catch (error) {
                    console.error('Lỗi khi tải thông tin:', error);
                }
            }
        };
        fetchCourseDetail();
    }, [id, isNewCourse]);

    useEffect(() => {
        const fetchLessons = async () => {
            if (!isNewCourse) {
                try {
                    const response = await axiosClient.get(`/lessons?id_khoa_hoc=${id}`);
                    const lessonsData = Array.isArray(response.data.data) ? response.data.data : response.data;
                    setLessons(lessonsData.sort((a, b) => a.thu_tu - b.thu_tu));
                } catch (error) {
                    console.error('Lỗi khi tải bài học:', error);
                }
            }
        };
        fetchLessons();
    }, [id, isNewCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'title') setErrorText('');
    };

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

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này?")) return;
        try {
            await axiosClient.delete(`/lessons/${lessonId}`);
            toast.success("Đã xóa bài học thành công!");
            setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
        } catch (error) {
            toast.error("Lỗi khi xóa bài học");
        }
    };

    return (
        <InstructorLayout>
            <div className="p-8 max-w-[1280px] mx-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h2 className="text-[32px] font-bold text-[#172B4D] dark:text-white leading-[40px] tracking-tight">
                                {isNewCourse ? 'Tạo khóa học mới' : formData.title || 'Đang tải...'}
                            </h2>
                            <p className="text-[16px] text-[#6B778C] dark:text-slate-400 mt-1">Thiết lập chương trình học, giá cả và hiển thị.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/instructor/courses')}
                                className="px-6 py-2 border border-[#DFE1E6] dark:border-slate-700 rounded-lg text-[14px] font-semibold text-[#172B4D] dark:text-slate-300 hover:bg-[#F4F5F7] dark:hover:bg-slate-800 transition-colors">
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

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* ================= CỘT TRÁI: Form Nhập liệu & Ảnh ================= */}
                    <div className="md:col-span-8 space-y-6">

                        {/* 1. Thông tin cơ bản */}
                        <section className="bg-white dark:bg-[#1E2329] border border-[#DFE1E6] dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#F4F5F7] dark:border-slate-800">
                                <FileEdit className="text-[#0052CC]" size={20} />
                                <h3 className="text-[20px] font-semibold text-[#172B4D] dark:text-white">Thông tin cơ bản</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#172B4D] dark:text-slate-300 mb-2">Tên khóa học <span className="text-red-500">*</span></label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-[#F4F5F7] dark:bg-[#14181D] border-none rounded-lg focus:ring-2 focus:ring-[#0052CC]/20 outline-none text-[#172B4D] dark:text-white text-[16px] transition-all`}
                                        type="text"
                                        placeholder="Nhập tên khóa học"
                                    />
                                    {errorText && <p className="text-red-500 text-sm mt-1">{errorText}</p>}
                                </div>

                                <div>
                                    <label className="block text-[14px] font-semibold text-[#172B4D] dark:text-slate-300 mb-2">Mô tả khóa học</label>
                                    <div className="border border-[#DFE1E6] dark:border-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0052CC]/20 transition-all">
                                        <div className="bg-[#F4F5F7] dark:bg-[#1A1D21] px-4 py-2 flex gap-4 border-b border-[#DFE1E6] dark:border-slate-700">
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
                                            className="w-full px-4 py-3 bg-white dark:bg-[#14181D] border-none focus:ring-0 text-[#172B4D] dark:text-slate-300 text-[14px] leading-relaxed outline-none resize-none"
                                            rows="8"
                                            placeholder="Viết mô tả chi tiết cho khóa học của bạn..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Ảnh minh họa (Đã chuyển xuống đây & Sửa UI) */}
                        <section className="bg-white dark:bg-[#1E2329] border border-[#DFE1E6] dark:border-slate-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <ImageIcon className="text-[#0052CC]" size={20} />
                                <h3 className="text-[18px] font-semibold text-[#172B4D] dark:text-white">Hình ảnh minh họa</h3>
                            </div>

                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                accept="image/*"
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

                            {imagePreview || formData.hinh_anh ? (
                                <div className="space-y-4 border border-[#DFE1E6] dark:border-slate-700 rounded-xl p-4 bg-[#F4F5F7] dark:bg-[#14181D]">
                                    <div className="rounded-lg overflow-hidden flex justify-center w-full bg-black aspect-[21/9] shadow-inner relative">
                                        <img
                                            src={imagePreview || formData.hinh_anh}
                                            alt="Preview"
                                            className="w-full h-full object-cover opacity-90"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <p className="text-xs text-[#6B778C] italic truncate max-w-[300px]">
                                            {formData.file_anh_that ? `Đã chọn: ${formData.file_anh_that.name}` : "Ảnh hiện tại của khóa học"}
                                        </p>
                                        <button
                                            onClick={() => document.getElementById('fileInput').click()}
                                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E2329] text-[#172B4D] dark:text-white hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm font-semibold transition-colors border border-[#DFE1E6] dark:border-slate-700 shadow-sm"
                                        >
                                            <UploadCloud size={16} /> Thay đổi ảnh
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => document.getElementById('fileInput').click()}
                                    className="group relative border-2 border-dashed border-[#DFE1E6] dark:border-slate-700 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer aspect-[21/9] flex flex-col items-center justify-center bg-[#F4F5F7] dark:bg-[#14181D]"
                                >
                                    <UploadCloud className="text-[#0052CC] mx-auto mb-4" size={32} />
                                    <p className="font-bold text-[#172B4D] dark:text-slate-300">Nhấn để tải ảnh khóa học lên</p>
                                    <p className="text-[13px] text-[#6B778C] mt-2">Định dạng hỗ trợ: JPG, PNG (Tối đa 5MB)</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ================= CỘT PHẢI: Cài đặt & Danh sách bài học ================= */}
                    <div className="md:col-span-4 space-y-6">

                        {/* 1. Thiết lập giá & Danh mục */}
                        <section className="bg-white dark:bg-[#1E2329] border border-[#DFE1E6] dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#172B4D] dark:text-slate-300 mb-2">Giá khóa học</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#0052CC]">VNĐ</span>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full pl-16 pr-4 py-3 bg-[#F4F5F7] dark:bg-[#14181D] border-none rounded-lg focus:ring-2 focus:ring-[#0052CC]/20 outline-none text-[#172B4D] dark:text-white text-[15px] font-bold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#172B4D] dark:text-slate-300 mb-2">Danh mục</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#F4F5F7] dark:bg-[#14181D] border-none rounded-lg appearance-none focus:ring-2 focus:ring-[#0052CC]/20 outline-none text-[#172B4D] dark:text-white text-[14px]"
                                    >
                                        <option>Web Development</option>
                                        <option>Data Science</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B778C]" size={16} />
                                </div>
                            </div>
                        </section>

                        {/* 2. Danh sách bài học (Đã chuyển sang đây & Thiết kế lại cho gọn) */}
                        {!isNewCourse && (
                            <section className="bg-white dark:bg-[#1E2329] border border-[#DFE1E6] dark:border-slate-800 rounded-xl p-5 shadow-sm sticky top-6">
                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F4F5F7] dark:border-slate-800">
                                    <h3 className="text-[16px] font-bold text-[#172B4D] dark:text-white">Chương trình học ({lessons.length})</h3>
                                    <button
                                        onClick={() => navigate(`/instructor/lessons/${id}`)}
                                        className="w-8 h-8 flex items-center justify-center bg-blue-50 text-[#0052CC] hover:bg-blue-600 hover:text-white rounded-full transition-colors"
                                        title="Thêm bài học mới"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                    {lessons.length > 0 ? (
                                        lessons.map((lesson, index) => (
                                            <div key={lesson.id} className="p-3 border border-[#DFE1E6] dark:border-slate-700 rounded-lg bg-white dark:bg-[#14181D] hover:border-blue-300 transition-colors group">
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-bold text-slate-500 mt-0.5">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-semibold text-[#172B4D] dark:text-slate-200 truncate" title={lesson.tieu_de}>
                                                            {lesson.tieu_de}
                                                        </p>
                                                        <p className="text-[11px] text-[#6B778C] mt-1 flex items-center gap-1">
                                                            {lesson.video_url ? '🎥 Có Video' : '📄 Bài viết'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Nút thao tác xếp hàng ngang bên trong thẻ bài học */}
                                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                    <button
                                                        onClick={() => navigate(`/instructor/lesson-detail/${lesson.id}`)}
                                                        className="flex-1 flex justify-center items-center gap-1.5 px-2 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-md transition-all"
                                                    >
                                                        <FileEdit size={12} />
                                                        <span className="text-[11px] font-semibold">Sửa</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteLesson(lesson.id)}
                                                        className="flex-1 flex justify-center items-center gap-1.5 px-2 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                        <span className="text-[11px] font-semibold">Xóa</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 bg-[#F4F5F7] dark:bg-[#14181D] rounded-lg border border-dashed border-[#DFE1E6] dark:border-slate-700">
                                            <p className="text-[13px] text-[#6B778C] dark:text-slate-400">Chưa có bài học nào.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Xóa Khóa Học */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091E42]/50 dark:bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1E2329] rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertTriangle size={28} />
                            <h3 className="text-xl font-bold">Cảnh báo xóa khóa học</h3>
                        </div>
                        <p className="text-[#434654] dark:text-slate-300 mb-6">
                            Bạn có chắc chắn muốn xóa khóa học này không?
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