import { spawn, execSync } from 'child_process';
import electron from 'electron'
import { watch, stat, readdir } from 'fs';
import { resolve } from 'path';

const __dirname = process.cwd();
let electronProcess = spawn(electron, [
    '--enable-unsafe-webgpu',
    '.'
], {
    stdio: 'inherit'
});

/**
 * 对传入的函数进行延时执行，并返回包装后的函数
 * @param func 需要执行的方法
 * @param delay 延迟时间ms
 * @returns {void}
 */
function debounce(func, delay = 500) {
    let timer = null;
    
    return function(...args) {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            func && func(...args);
        }, delay);
    }
}

// 被监听的目录路径
const watchDir = resolve(__dirname, `${process.argv[2]}`);

// 轮询回调函数
const processor = debounce((filename) => {
    const oldTime = Date.now();
    const configFile = resolve(__dirname, 'configs/electron-watch.tsconfig.json');
    execSync(`tsc -p ${configFile}`);
    console.log(filename, `${Date.now() - oldTime}ms`);
    // electronProcess && electronProcess.kill();

    // electronProcess = spawn(electron, [
    //     '--enable-unsafe-webgpu',
    //     '.'
    // ], {
    //     stdio: 'inherit'
    // });
});


/**
 * 监听目录, 执行更新操作
 * @param pathname 相对路径
 * @param callback 文件触发回调
 */
function watchFile(pathname, callback) {
    stat(pathname, (_, status) => {
        if (_) {
            return;
        }

        readdir(pathname, 'utf8', (_, info) => {
            if (info && info.length) {
                watch(pathname, (event, filename) => {
                    callback && callback(
                        `${event}: ${filename}`
                    );
                });
            }
        });
    });
}

watchFile(watchDir, processor);
