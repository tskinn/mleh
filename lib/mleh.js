'use babel';

import MlehView from './mleh-view';
import { CompositeDisposable } from 'atom';

export default {

  mlehView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.mlehView = new MlehView(state.mlehViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mlehView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mleh:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mlehView.destroy();
  },

  serialize() {
    return {
      mlehViewState: this.mlehView.serialize()
    };
  },

  toggle() {
    console.log('Mleh was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
