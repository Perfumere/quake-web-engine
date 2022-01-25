import { Engine } from '../engine';
import Triangle from './triangle';
import Rectangle from './rectangle';
import Cube from './cube';

type GraphMapType = 'triangle' | 'rectangle' | 'cube';

const graphMap = {
    triangle: Triangle,
    rectangle: Rectangle,
    cube: Cube
};

export const draw = (type: GraphMapType) => {
    const engine = new Engine({
        canvasOptions: {
            width: 400,
            height: 400,
            style: {
                boxShadow: '1px 2px 20px #eee'
            }
        }
    });

    engine.drawFrame(graphMap[type]);
};
