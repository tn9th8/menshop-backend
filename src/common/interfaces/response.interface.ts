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
    //
    message?: string[];
}

export interface Result<T> {
    metadata: Metadata,
    data: T[]
}

export interface ResultOne<T> {
    metadata: Metadata,
    data: T
}

