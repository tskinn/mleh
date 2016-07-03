'use babel';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Infinite from 'react-infinite';
import MlehView from './mleh-view';
import { CompositeDisposable } from 'atom';

export class MlehController {
  constructor() {
    this.view = new MlehView();
    this.panel = null;
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mleh:toggle': () => this.toggle()
    }));

  }

  toggle() {
    if (this.panel) {
      this.detach();
    } else {
      this.attach();
    }
  }

  detach() {
    if (this.panel == null) {
      return;
    }
    this.panel.destroy();
    this.panel = null;
    atom.workspace.getActivePane().activate();
  }

  attach() {
    if (this.panel !== null) {
      return;
    }

    this.panel = this.view.createPanel();
  }

  // Tear down any state and detach
  destroy() {
    this.detach();
    this.subscriptions.dispose();
    this.element.remove();
  }
}
