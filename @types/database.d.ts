type OpenDBTaskKey = 'upgradeneeded' | 'success';

interface StoreIndexOptions {

    /**
     * 索引名称
     */
    name: string;

    /**
     * 索引应用在的字段名
     */
    keyPath: string | string[];

    /**
     * 是否为唯一索引
     */
    unique?: boolean;
}

interface IdxDBCtor {

    /**
     * 获取数据库
     * @returns 数据库实例
     */
    getDatabase: () => Promise<IDBDatabase>;

    /**
     * 获取指定名称的数据仓库
     * @returns 获取数据库
     */
    async getStore: (name: string, mode: IDBTransactionMode) => Promise<IDBObjectStore>;

    /**
     * 指定数据仓库上建立的事务
     * @returns 获取数据库
     */
    async getTransaction(name: string, mode: IDBTransactionMode): Promise<IDBTransaction>;

    /**
     * 执行查询请求
     * @param request 查询请求
     * @returns 返回数据
     */
    execRequest(request: IDBRequest, mode: boolean = false);

    /**
     * 创建指定名称的数据仓库
     * @param name 指定数据仓库的名称
     * @param options {IDBObjectStoreParameters} keyPath: 主键, autoIncrement: 是否自增
     */
    createStore(name: string, options?: IDBObjectStoreParameters, indexOptions?: StoreIndexOptions[]);

    /**
     * 通过主键值查找数据
     * @param name 数据仓库名称
     * @param keyName 主键值
     * @returns 数据 | null
     */
    async findById(name: string, keyName: IDBValidKey): Promise<any>;

    /**
     * 通过索引值查找数据
     * @param name 数据仓库名称
     * @param keyName 主键值
     * @returns 数据 | null
     */
    async findByIndex(name: string, indexName: string, index: IDBValidKey): Promise<any>;

    /**
     * 查找所有数据
     * @param name 数据仓库名称
     * @param keyName 索引值
     * @returns 数据 | null
     */
    async findAll(name: string, indexName?: string): Promise<any[]>;

    /**
     * 通过索引值删除数据
     * @param name 数据仓库名称
     * @param keyName 主键值
     * @returns 删除状态
     */
    async deleteById(name: string, keyName: IDBValidKey): Promise<boolean>;

    /**
     * 添加 / 修改数据，修改数据时不允许修改索引，否则更新失败
     * @param name 数据仓库名称
     * @param data 需要存储/更新的数据
     * @returns 更新状态
     */
    async store(name: string, data: any): Promise<boolean>;
}
