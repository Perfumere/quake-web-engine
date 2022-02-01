import { draw } from './tests';
import { Engine } from './engine';
import test from '@/assets/images/brick.png';

const engine = new Engine({
    canvasOptions: {
        width: 400,
        height: 400,
        style: {
            boxShadow: '1px 2px 20px #eee'
        }
    }
});

engine.createImageTexture(test);

draw('cube');
