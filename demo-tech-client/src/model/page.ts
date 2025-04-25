
export interface Page<T> {
    content: T[]; // Danh sách các phần tử
    totalItems: number; // Tổng số mục
    totalPages: number; // Tổng số trang
    currentPage: number; // Trang hiện tại
    pageSize: number; // Số mục trên mỗi trang
}
export class PageImpl<T> implements Page<T> {
    content: T[] = [];
    totalItems: number = 0;
    totalPages: number = 0;
    currentPage: number = 1;
    pageSize: number = 10;
    constructor(init?: Partial<PageImpl<T>>) {
        Object.assign(this, init);
    }
}
