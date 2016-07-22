'use babel';

import MlehController from '.controller';

let controller = null;

export function activate(state) {
  controller = new MlehController();
}

export function deactivate() {
  controller.detach();
  controller.destory();
  controller = null;
}
