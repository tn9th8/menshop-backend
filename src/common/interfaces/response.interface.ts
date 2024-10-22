export interface Metadata {
    items?: number,
    pages?: number,
    page?: number,
    limit?: number,
    alert?: string[],
    updatedCount?: number,
    queriedCount?: number,
}

export interface Result<T> {
    metadata: Metadata,
    data: T
}

