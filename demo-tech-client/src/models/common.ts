export interface Search {
    keyword: string
    pageIndex: number
    pageSize: number
}
export interface Page<T> {
    content: T[];          // danh sách dữ liệu
    totalElements: number; // tổng số phần tử
    totalPages: number;    // tổng số trang
    pageIndex: number;    // số trang hiện tại (bắt đầu từ 0 hoặc 1 tuỳ backend)
    pageSize: number;      // số bản ghi mỗi trang
}
