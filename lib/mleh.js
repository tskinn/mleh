'use babel';

import {CompositeDisposable} from 'atom';
import MlehView from './mleh-view';

export default {
  activate(state) {
    this.mleh = new MlehView();
    this.mleh.createPanel();
    console.log(this.mleh.contentContainer);
    this.mleh.contentContainer.style.position = "relative";
    this.mleh.contentContainer.style.bottom = "0px";
  //  Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mleh:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.commands.add('.mleh', {
      'mleh:move-cursor-down': () => this.mleh.moveCursorDown(),
      'mleh:move-cursor-up': () => this.mleh.moveCursorUp()
    }));

    this.mleh.onDidClickOutside(::this.detach);
  },

  deactivate() {
    if (this.mleh) {
      this.mleh.destroy();
    }
  },

  detach() {
    this.mleh.destroy();
  },

  toggle() {
    this.mleh.toggle();
  }
}
