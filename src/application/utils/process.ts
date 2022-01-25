/**
 * @file   处理数据
 * @author Perfumere
 * @date   2022-01-01
 */

/**
 * 获取字段类型
 * @param target T
 * @returns string
 */
export const getType = (target: any): string => {
    const type = typeof target;

    if (type === 'object' || type === 'function') {
        return Object.prototype.toString.call(target).split(' ')[1].slice(0, -1).toLowerCase();
    }

    return type;
};

/**
 * 匹配字段的类型
 * @param target T
 * @param type string | array | object | null | undefined | function | asyncfunction
 * @returns boolean
 */
export const checkType = (target: any, type: string | string[]): boolean => {
    const targetType = getType(target);

    if (typeof type === 'string') {
        return targetType === type;
    }

    return type.includes(targetType);
};

/**
 * 比较类型
 * @param target any
 * @param other  any
 * @returns boolean
 */
export const compareType = (target: any, other: any) => {
    return getType(target) === getType(other);
};

/**
 * 克隆并返回数据
 * @param target T
 * @returns T
 */
export const cloneData = <T>(target: T): T => {
    try {
        return JSON.parse(JSON.stringify(target));
    }
    catch {
        return {} as T;
    }
};

/**
 * 混淆传入的两个对象
 * @param o1 T
 * @param o2 T
 * @returns T
 */
export const mixinData = <T, U>(o1: T, o2: U, clone: boolean = false): T & U => {
    if (!o1) {
        return <T & U>(clone ? cloneData(o2) : o2);
    }
    if (!o2) {
        return <T & U>(clone ? cloneData(o1) : o1);
    }

    const target = clone ? cloneData(o1) : o1;
    const needle = clone ? cloneData(o2) : o2;

    function assign (o1: any, o2: any) {
        if (!o1) {
            return o2;
        }
        if (!o2) {
            return o1;
        }
        if (!checkType(o1, ['object', 'array']) || !checkType(o2, ['object', 'array'])) {
            return o2;
        }

        Object.keys(o2).forEach(key => {
            if (checkType(o1[key], 'array') && checkType(o2[key], 'array')) {
                o1[key] = assign(o1[key], o2[key]);
            }
            else if (checkType(o1[key], 'object') && checkType(o2[key], 'object')) {
                o1[key] = assign(o1[key], o2[key]);
            }
            else {
                o1[key] = o2[key];
            }
        });

        return <T & U>o1;
    }

    return assign(target, needle);
}

/**
 * 冻结对象, 设置属性为只读方式
 */
export const freeze = <T>(target: T) => {
    return <Readonly<T>>Object.freeze(target);
};

/**
 * 获取pure对象
 */
export const pureData = <T>(target?: T) => {
    if (checkType(target, 'object')) {
        return Object.setPrototypeOf(target, null);
    }

    return <T>Object.create(null);
}

export default {
    getType,
    checkType,
    compareType,
    cloneData,
    mixinData,
    freeze,
    pureData
};
