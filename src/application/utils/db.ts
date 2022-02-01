/**
 * @file   客户端数据库工具
 * @author Perfumere
 * @date   2022-02-01
 */

/**
 * 开启数据库后的回调队列
 */
const OPEN_DB_TASK: Record<OpenDBTaskKey, Function[]> = {

    /**
     * running on the stage of IDBOpenDBRequest.onupgradeneeded
     */
    upgradeneeded: [],

    /**
     * running on the stage of IDBOpenDBRequest.onsuccess
     */
    success: []
};

export class IdxDB implements IdxDBCtor {
    #database: IDBDatabase;

    constructor(name: string, version?: number) {
        const request = indexedDB.open(name, version);
        request.addEventListener('upgradeneeded', () => {
            this.#database = request.result;
            const length = OPEN_DB_TASK.upgradeneeded.length;

            for (let i = 0; i < length; ++i) {
                OPEN_DB_TASK.upgradeneeded.shift()();
            }
        });
        request.addEventListener('success', () => {
            this.#database = request.result;
            const length = OPEN_DB_TASK.success.length;
            for (let i = 0; i < length; ++i) {
                OPEN_DB_TASK.success.shift()();
            }
        });
    }

    getDatabase(): Promise<IDBDatabase> {
        return new Promise(resolve => {
            if (!this.#database) {
                OPEN_DB_TASK.success.push(() => resolve(this.#database));
            }
            else {
                resolve(this.#database);
            }
        });
    }

    async getStore(name: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        return (
            await this.getDatabase()
        )
        .transaction([ name ], mode)
        .objectStore(name);
    }

    async getTransaction(name: string, mode: IDBTransactionMode): Promise<IDBTransaction> {
        return (
            await this.getDatabase()
        )
        .transaction([ name ], mode);
    }

    execRequest(request: IDBRequest, mode: boolean = false) {
        return new Promise(resolve => {
            request.onsuccess = () => resolve(mode ? true : request.result);
            request.onerror = () => resolve(mode ? false : null);
        });
    }

    createStore(name: string, options?: IDBObjectStoreParameters, indexOptions?: StoreIndexOptions[]) {
        OPEN_DB_TASK.upgradeneeded.push(() => {
            if (this.#database && !this.#database.objectStoreNames.contains(name)) {
                const store = this.#database.createObjectStore(name, options);

                if (indexOptions) {
                    indexOptions.forEach(indexOption => {
                        store.createIndex(indexOption.name, indexOption.keyPath, {
                            unique: !!indexOption.unique
                        });
                    });
                }
            }
        });
    };

    async findById(name: string, keyName: IDBValidKey): Promise<any> {
        const store = await this.getStore(name, 'readonly');
        return this.execRequest(store.get(keyName));
    }

    async findByIndex(name: string, indexName: string, index: IDBValidKey): Promise<any> {
        const store = await this.getStore(name, 'readonly');
        return this.execRequest(store.index(indexName).get(index));
    }

    async findAll(name: string, indexName?: string): Promise<any[]> {
        const store = await this.getStore(name, 'readonly');
        return <Promise<any[]>>this.execRequest(
            indexName ? store.index(indexName).getAll() : store.getAll()
        );
    }

    async deleteById(name: string, keyName: IDBValidKey): Promise<boolean> {
        const store = await this.getStore(name, 'readwrite');
        return <Promise<boolean>>this.execRequest(store.delete(keyName), true);
    }

    async store(name: string, data: any): Promise<boolean> {
        const store = await this.getStore(name, 'readwrite');
        return <Promise<boolean>>this.execRequest(store.put(data), true);
    }
}
