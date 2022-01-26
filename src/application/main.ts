import { draw } from './tests';
import { WorkerCtrl } from './utils/worker';

const worker = new WorkerCtrl(() => {
    addEventListener('message', ({ data }) => {
        console.log(data);
    });

    postMessage(Date.now());
    setTimeout(() => {
        close()
    }, 2000)
});

worker.onmessage = function({ data }) {
    console.log(data)
}

worker.onerror = function(event) {
    console.log('error', event);
}

// worker.addEventListener('message', ({ data }) => {
//     console.log(data, Date.now() - data)
// })


draw('cube');
