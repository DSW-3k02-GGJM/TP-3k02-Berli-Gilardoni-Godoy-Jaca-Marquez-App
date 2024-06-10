export interface Repository<T> {
    findAll(): T[] | undefined //void
    findOne(item: {id: string}): T | undefined
    add(item: T): T | undefined
    update(item: T): T | undefined
    delete(item: {id: string}): T | undefined
}