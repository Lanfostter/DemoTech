export interface Search {
    pageIndex: number;
    pageSize: number;
    fromDate?: Date | null;
    toDate?: Date | null;
}
export class UserSearch implements Search {
    pageIndex: number = 1;
    pageSize: number = 10;
    fromDate: Date | null = null;
    toDate: Date | null = null;
}
