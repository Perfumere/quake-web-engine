import { nanoid } from 'nanoid';
import { pureData } from './process';

export const Unique = pureData(
    Object.defineProperties({}, {
        key: {
            get() {
                return nanoid();
            },
            enumerable: false,
            configurable: false
        }
    }) as UniqueData
);
