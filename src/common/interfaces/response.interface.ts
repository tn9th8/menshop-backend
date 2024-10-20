export interface Result<T> {
    metadata: {
        alert?: string[]
    },
    data: T
}

