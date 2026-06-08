Đề bài Bài tập lớn (Bản đơn giản): Xây dựng Ứng dụng TMĐT Thu nhỏ
Mục tiêu: Sinh viên thiết kế và lập trình một ứng dụng TMĐT cơ bản (bao gồm cả Frontend và Backend), tập trung vào việc xử lý các luồng dữ liệu, tính toán các loại doanh thu nền tảng và bộ quy tắc chống gian lận.
Giai đoạn 1: Thiết kế và Tổ chức Dữ liệu 
Yêu cầu thiết kế cấu trúc dữ liệu cơ bản:
Users: ID, Tên, Số ngày tạo tài khoản, Hạn mức ví BNPL (ví dụ: mặc định 10.000.000đ).
Sellers: ID, Tên, Loại gian hàng (freemium hoặc premium).
Products: ID, Tên, Giá, Gian hàng nào bán, Xuất xứ (Trong nước hoặc Quốc tế).
Orders: ID, ID Người mua, ID Người bán, Giá trị gốc, Các loại phí phát sinh, Phương thức thanh toán, Trạng thái gian lận (True/False).
Giai đoạn 2: Phát triển Backend 
Viết các API để xử lý các bài toán nghiệp vụ sau:
1. Module Tính toán Doanh thu & Đơn hàng
Phí hoa hồng (Marketplace): Đơn hàng thuộc người bán freemium thu phí 5% giá trị đơn. Người bán premium thu phí 2%.
Hàng xuyên biên giới (Cross-border): Nếu sản phẩm có xuất xứ Quốc tế, Backend tự động cộng thêm 10% thuế nhập khẩu vào giá đơn hàng và mặc định hiển thị thời gian giao hàng là 10 ngày (hàng trong nước là 2 ngày).
2. Module Tích hợp Tài chính (Fintech - BNPL)
Nếu khách hàng chọn thanh toán payment_method == "bnpl":
Hệ thống cộng thêm 3% phí dịch vụ tài chính vào tổng đơn.
Kiểm tra hạn mức của User: Nếu tổng số tiền phải trả vượt quá hạn mức ví BNPL, API sẽ từ chối tạo đơn và trả về thông báo lỗi.
3. Module Phí vận chuyển (LaaS)
Mặc định phí vận chuyển đồng giá: 30.000đ/đơn hàng.
Ưu đãi hội viên: Nếu tài khoản User có đánh dấu là Hội viên mua gói ship (Subscription), hệ thống sẽ set phí vận chuyển về 0đ.
4. Module Kiểm tra Gian lận & Gợi ý (Rule-based)
Chống gian lận: Hệ thống tự động gắn dấu is_fraud = True nếu đơn hàng thỏa mãn điều kiện: Tài khoản mới tạo < 1 ngày
Gợi ý sản phẩm: Viết một API đơn giản nhận vào ID sản phẩm khách đang xem, trả về danh sách các sản phẩm khác có cùng danh mục hoặc cùng người bán.
Giai đoạn 3: Phát triển Frontend (Giao diện trực quan, đơn giản)
Sinh viên xây dựng giao diện bằng HTML/CSS/JS thuần hoặc các framework cơ bản:
1. Giao diện Người mua (Thiết kế dạng thanh dọc Mobile)
Trang sản phẩm: Hiển thị danh sách sản phẩm công khai. Nhấp vào một sản phẩm sẽ thấy danh sách "Sản phẩm tương tự" bên dưới.
Nút "Mua ngay" (Shoppertainment): Giả lập tính năng của TikTok Shop. Cạnh sản phẩm có nút "Mua ngay", khi bấm vào, hệ thống tự động tạo đơn với thông tin mặc định (không cần qua các bước giỏ hàng phức tạp) để tối giản luồng code.
Trang Thanh toán: Có ô chọn phương thức thanh toán (COD, Thẻ, BNPL). Nếu chọn BNPL, giao diện phải hiển thị thêm số tiền phụ phí 3%.
2. Giao diện Quản trị (Admin Dashboard)
Không cần vẽ biểu đồ động phức tạp. Chỉ cần hiển thị một bảng tổng hợp các con số:
Tổng tiền hoa hồng thu được từ người bán.
Tổng tiền lãi thu được từ dịch vụ BNPL.
Tổng số đơn hàng bị gắn cờ gian lận (is_fraud == True).
Một danh sách các đơn hàng gian lận để Admin có thể bấm nút "Duyệt đơn" hoặc "Hủy đơn".
