export default function CourseCard({ title, instructor, price, image }) {
    return (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-sm transition-shadow group cursor-pointer">
            <div className="aspect-video bg-gray-100 relative">
                {/* Placeholder cho ảnh khóa học */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-[15px] tracking-tight mb-1 line-clamp-1">{title}</h3>
                <p className="text-[11px] text-gray-500 mb-3">{instructor}</p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="font-bold text-sm">{price}</span>
                    <button className="text-[11px] font-medium text-[#0071E3] hover:underline">Xem thêm</button>
                </div>
            </div>
        </div>
    );
}