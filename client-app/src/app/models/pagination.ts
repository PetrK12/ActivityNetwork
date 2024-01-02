export interface IPagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    data: T;
    pagination: IPagination;

    constructor(data: T, pagination: IPagination){
        this.data = data;
        this.pagination = pagination;
    }
}

export class PagingParams {
    pageNumber: number;
    pageSize: number;

    constructor(pageNumber: number = 1, pageSize: number = 2){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}