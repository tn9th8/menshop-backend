export interface Result<T> {
    metadata: {
        alert?: string[],
        items?: number,
        pages?: number,
        page?: number,
        limit?: number
    },
    data: T
}

