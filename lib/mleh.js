'use babel';

import MlehView from './mleh-view';
import { CompositeDisposable } from 'atom';

export default {

  mlehView: null,
  bottomPanel: null,
  subscriptions: null,

  activate(state) {
    this.mlehView = new MlehView(state.mlehViewState);
    this.bottomPanel = atom.workspace.addBottomPanel({
      item: this.mlehView.getElement(),
      visible: false,
      priority: 100
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mleh:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.bottomPanel.destroy();
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
      this.bottomPanel.isVisible() ?
      this.bottomPanel.hide() :
      this.bottomPanel.show()
    );
  }

};
