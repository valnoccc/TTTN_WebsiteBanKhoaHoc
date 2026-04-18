import { LogOut, BookOpenText, Users, Presentation, PlusCircle } from 'lucide-react';

export default function InstructorDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 h-12 flex items-center justify-between px-6">
                <div className="font-semibold tracking-tight text-sm">Cổng Giảng Viên</div>
                <div className="flex items-center gap-4 text-xs">
                    <span className="font-medium">GV. {user?.fullName}</span>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/login' }} className="hover:text-red-500">
                        <LogOut size={14} />
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-8">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight">Quản lý Lớp học.</h1>
                    <button className="flex items-center gap-1.5 text-[12px] bg-[#0071E3] text-white px-4 py-1.5 rounded-md font-medium hover:bg-[#0077ED]">
                        <PlusCircle size={14} /> Tạo Khóa học mới
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {/* Stats similar to Admin but Instructor-focused */}
                    <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                        <Presentation size={18} className="text-purple-500 mb-3" />
                        <div className="text-2xl font-semibold">05</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Khóa học đang dạy</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                        <Users size={18} className="text-blue-500 mb-3" />
                        <div className="text-2xl font-semibold">150</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Tổng Học viên</div>
                    </div>
                </div>

                {/* List of their courses */}
            </main>
        </div>
    );
}