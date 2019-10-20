import { DocumentCollection } from "arangojs"

export const CreateIfNotExists = {
    async collection<T extends object> (collection: DocumentCollection<T>) {
        if (!await collection.exists()) {
            await collection.create()
        }
        return collection
    },
    async uniqueIndex<T extends object> (collection: DocumentCollection<T>, indexName: string, indexPath: string) {
        if (!(await collection.indexes()).includes(indexName)) {
            await collection.createPersistentIndex(indexPath, { unique: true })
        }
    }
}
