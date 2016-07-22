'use babel';

import Infinite from 'react-infinite';
import MlehCommand from 'command';

const MODES = {
  FILE: 1,
  COMMAND: 2,
  OCCUR: 3,
};

export default class MlehController {
  constructor() {
    this.currentMode = null;

  //  Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mleh:toggle-command': () => this.toggle-command(),
      'mleh:toggle-file': () => this.toggle-file(),
      'mleh:toggle-occur': () => this.toggle-occur()
    }));
  }

  subscribeGeneral() {
    this.subscriptions.add(atom.commands.add('.mleh', {
      'mleh:move-cursor-down': () => this.mleh.moveCursorDown(),
      'mleh:move-cursor-up': () => this.mleh.moveCursorUp(),
      'core:cancel': () => this.detach()
    }));
  }

  unsubscribeGeneral() {
    this.subscriptions.dispose();
  }

  // move these into the subscription if possible. may not be necesary
  toggle-command() {
    toggle(MODES.COMMAND);
  }

  toggle-file() {
    toggle(MODES.FILE);
  }

  toggle-occur() {
    toggle(MODES.OCCUR);
  }

  toggle(mode) {
    if (currentMode != null) {
      currentMode.detach();
      currentMode.destroy();
      currentMode = null;
      return;
    }

    switch (mode) {
      case MODES.COMMAND:
        currentMode = new MlehCommand();
        break;
      case MODES.FILE:
        currentMode = new MlehFiles();
        break;
      case MODES.OCCUR:
        currentMode = new MlehOccur();
        break;
      default:

    }
  }

  deactivate() {
    if (this.mleh) {
      this.mleh.destroy();
    }
  }

  destory() {
    this.subscriptions.dispose();
  }

  detach() {
    // if (this.panel === null) {
    //   return;
    // }
    this.mleh.destroy();
    //this.panel.destroy();
    //this.panel = null;
    atom.workspace.getActivePane().activate();
  }

  attach() {

  }

}
