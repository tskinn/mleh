'use babel';

import MlehController from './controller';

let controller = null;

export function activate(state) {
  controller = new MlehController();
  // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
  this.subscriptions = new CompositeDisposable();

  // Register command that toggles this view
  this.subscriptions.add(atom.commands.add('atom-workspace', {
    'mleh:toggle-command': () => controller.togglecommand(),
    'mleh:toggle-file': () => controller.togglefile(),
    'mleh:toggle-occur': () => controller.toggleoccur(),
	  'mleh:toggle-buffers': () => controller.togglebuffers(),
    'core:cancel': () => controller.toggle(controller.currentMode)
  }));
}

export function deactivate() {
  this.subscriptions.dispose();
  controller.detach();
  controller.destroy();
  controller = null;
}
