export interface Metadata {
    //paginate
    items?: number,
    pages?: number,
    page?: number,
    limit?: number,
    //count database documents
    updatedCount?: number,
    queriedCount?: number,
    deletedCount?: number;
}

export interface Result<T> {
    metadata: Metadata,
    data: T[]
}

