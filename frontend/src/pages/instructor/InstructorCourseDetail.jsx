import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import CourseCard from '../../components/ui/CourseCard';
import axiosClient from '../../api/axios';
import { BookOpen, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstructorCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await axiosClient.get('/courses/my-courses');
            setCourses(response.data.data);
        } catch (error) {
            toast.error('Không thể tải danh sách khóa học!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <InstructorLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Khóa học của tôi.</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Quản lý nội dung giảng dạy và tiến độ học viên.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#0071E3] text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[#0077ED] transition-colors shadow-sm whitespace-nowrap">
                    <PlusCircle size={16} /> Tạo khóa học mới
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="bg-white border border-gray-200 rounded-md p-4 animate-pulse">
                            <div className="w-full h-36 bg-gray-100 rounded-md mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <Link to={`/instructor/courses/${course.id}`} key={course.id}>
                            <CourseCard
                                title={course.ten_khoa_hoc}
                                instructor="Bạn"
                                price={course.gia > 0 ? `${Number(course.gia).toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                                image={course.hinh_anh}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">Chưa có khóa học nào</h3>
                    <p className="text-gray-500 text-[13px] font-medium max-w-sm mb-6">Bạn chưa tạo khóa học nào trên hệ thống. Hãy bắt đầu chia sẻ kiến thức ngay.</p>
                    <button className="bg-white border border-gray-300 text-[#1D1D1F] px-4 py-2 rounded-md text-[13px] font-medium hover:bg-gray-50 transition-colors">
                        Khởi tạo ngay
                    </button>
                </div>
            )}
        </InstructorLayout>
    );
}