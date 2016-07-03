/** @babel */

import {MlehController} from './controller';

let ctrl = null

export function activate(state) {
  ctrl = new MlehController();
}

export function deactivate() {
  ctrl.detach();
  ctrl.destroy();
  ctrl = null;
}
