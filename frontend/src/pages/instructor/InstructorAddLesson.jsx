import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import axiosClient from '../../api/axios';
import { 
    ChevronRight, Lock, PlayCircle, Bold, Italic, 
    List, Link as LinkIcon, Image as ImageIcon, Code, 
    Info, CheckCircle2, Save 
} from 'lucide-react';
import toast from 'react-hot-toast';


export default function InstructorAddLesson() {
    const { id } = useParams(); // Lấy ID khóa học từ URL
    const navigate = useNavigate();

    const [lessonData, setLessonData] = useState({
        tieu_de: '',
        thu_tu: 1,
        video_url: '',
        noi_dung: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLessonData({ ...lessonData, [name]: value });
    };

    const handleSave = async (e) => {
       e.preventDefault();
        
        if (!lessonData.tieu_de.trim()) {
            toast.error('Vui lòng nhập tiêu đề bài học!');
            return;
        }

        try {
            // Gọi API POST để lưu dữ liệu xuống DB
            await axiosClient.post(`/courses/${id}/lessons`, lessonData);
            
            toast.success('Đã lưu bài học thành công!');
            navigate(`/instructor/courses/${id}`); // Quay lại trang chi tiết khóa học
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi lưu bài học vào hệ thống!');
        }
    };

    return (
        <InstructorLayout>
            <div className="p-8 max-w-[1000px] mx-auto w-full font-sans text-slate-200">
                
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#6B778C] uppercase tracking-wider mb-6">
                    <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/instructor/courses')}>My Courses</span>
                    <ChevronRight size={14} />
                    <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate(`/instructor/courses/${id}`)}>Course Detail</span>
                    <ChevronRight size={14} />
                    <span className="text-blue-500">Add New Lesson</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-[28px] font-bold text-white mb-2">Thêm bài học mới</h2>
                    <p className="text-[14px] text-[#8B949E]">Điền các thông tin chi tiết để tạo bài học mới cho học viên của bạn.</p>
                </div>

                {/* Form Container */}
                <div className="bg-[#1C2128] border border-[#30363D] rounded-xl overflow-hidden shadow-lg mb-6">
                    
                    {/* Section 1: Thông tin cơ bản */}
                    <div className="p-8 border-b border-[#30363D] grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4">
                            <h3 className="text-[16px] font-semibold text-white mb-1">Thông tin cơ bản</h3>
                            <p className="text-[13px] text-[#8B949E]">Tiêu đề và vị trí của bài học trong lộ trình khóa học.</p>
                        </div>
                        <div className="md:col-span-8 space-y-5">
                            <div>
                                <label className="block text-[13px] font-medium text-[#C9D1D9] mb-2">Tiêu đề bài học</label>
                                <input 
                                    name="tieu_de"
                                    value={lessonData.tieu_de}
                                    onChange={handleChange}
                                    className="w-full bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] text-[14px] rounded-md px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder="Nhập tiêu đề bài học (vd: Giới thiệu về React Hooks)"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-medium text-[#C9D1D9] mb-2">ID khóa học</label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
                                        <input 
                                            disabled
                                            value={`COURSE-${id}`}
                                            className="w-full bg-[#0D1117] border border-[#30363D] text-[#8B949E] text-[14px] rounded-md pl-9 pr-4 py-2.5 opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-[#C9D1D9] mb-2">Thứ tự hiển thị</label>
                                    <input 
                                        type="number"
                                        name="thu_tu"
                                        value={lessonData.thu_tu}
                                        onChange={handleChange}
                                        className="w-full bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] text-[14px] rounded-md px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Nội dung & Video */}
                    <div className="p-8 border-b border-[#30363D] grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4">
                            <h3 className="text-[16px] font-semibold text-white mb-1">Nội dung & Video</h3>
                            <p className="text-[13px] text-[#8B949E]">Cung cấp tài liệu học tập và video bài giảng cho học viên.</p>
                        </div>
                        <div className="md:col-span-8 space-y-5">
                            <div>
                                <label className="block text-[13px] font-medium text-[#C9D1D9] mb-2">URL Video (Youtube/Vimeo)</label>
                                <div className="relative">
                                    <PlayCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
                                    <input 
                                        name="video_url"
                                        value={lessonData.video_url}
                                        onChange={handleChange}
                                        className="w-full bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] text-[14px] rounded-md pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-[#C9D1D9] mb-2">Nội dung bài học</label>
                                <div className="border border-[#30363D] rounded-md overflow-hidden bg-[#0D1117]">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-4 px-4 py-3 border-b border-[#30363D] bg-[#161B22]">
                                        <button className="text-[#8B949E] hover:text-white transition-colors"><Bold size={16} /></button>
                                        <button className="text-[#8B949E] hover:text-white transition-colors"><Italic size={16} /></button>
                                        <button className="text-[#8B949E] hover:text-white transition-colors"><List size={16} /></button>
                                        <div className="w-[1px] h-4 bg-[#30363D]"></div>
                                        <button className="text-[#8B949E] hover:text-white transition-colors"><LinkIcon size={16} /></button>
                                        <button className="text-[#8B949E] hover:text-white transition-colors"><ImageIcon size={16} /></button>
                                        <button className="text-[#8B949E] hover:text-white transition-colors"><Code size={16} /></button>
                                    </div>
                                    <textarea 
                                        name="noi_dung"
                                        value={lessonData.noi_dung}
                                        onChange={handleChange}
                                        rows="10"
                                        className="w-full bg-transparent text-[#C9D1D9] text-[14px] p-4 focus:outline-none resize-y"
                                        placeholder="Nhập nội dung bài học chi tiết tại đây..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 bg-[#161B22] flex justify-end gap-3 items-center">
                        <button 
                            onClick={() => navigate(`/instructor/courses/${id}`)}
                            className="px-5 py-2 text-[14px] font-medium text-[#C9D1D9] hover:text-white border border-[#30363D] hover:bg-[#30363D] rounded-md transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-5 py-2 flex items-center gap-2 text-[14px] font-medium text-white bg-[#238636] hover:bg-[#2EA043] border border-[#238636] rounded-md transition-colors shadow-sm"
                        >
                            <Save size={16} /> Lưu bài học
                        </button>
                    </div>
                </div>

                {/* Bottom Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#1C2128] border border-[#30363D] p-5 rounded-xl flex items-start gap-4">
                        <div className="bg-[#1F6FEB]/20 p-2 rounded-lg mt-1">
                            <Info size={20} className="text-[#58A6FF]" />
                        </div>
                        <div>
                            <h4 className="text-white text-[14px] font-semibold mb-1">Mẹo nhỏ: Video</h4>
                            <p className="text-[#8B949E] text-[12px] leading-relaxed">Hãy sử dụng link YouTube ở chế độ "Không công khai" (Unlisted) để bảo vệ bản quyền bài học của bạn.</p>
                        </div>
                    </div>
                    <div className="bg-[#1C2128] border border-[#30363D] p-5 rounded-xl flex items-start gap-4">
                        <div className="bg-[#238636]/20 p-2 rounded-lg mt-1">
                            <CheckCircle2 size={20} className="text-[#3FB950]" />
                        </div>
                        <div>
                            <h4 className="text-white text-[14px] font-semibold mb-1">Kiểm tra hiển thị</h4>
                            <p className="text-[#8B949E] text-[12px] leading-relaxed">Sau khi lưu, bạn có thể xem trước bài học ở giao diện học viên để đảm bảo định dạng hiển thị đúng.</p>
                        </div>
                    </div>
                </div>

            </div>
        </InstructorLayout>
    );
}