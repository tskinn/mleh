'use babel';

import MlehView from './mleh-view';
import {Component} from 'react';

export default class MlehCommand {
  constructor() {
    settings = {
      listItem: ListItem
    }
    this.view = MlehView(settings);

    this.mleh.createPanel();
    console.log(this.mleh.contentContainer);
    this.mleh.contentContainer.style.position = "relative";
    this.mleh.contentContainer.style.bottom = "0px";
  //  Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mleh:toggle-command': () => this.toggle-command(),
      'mleh:toggle-file': () => this.toggle-file(),
      'mleh:toggle-occur': () => this.toggle-occur()
    }));

    this.subscriptions.add(atom.commands.add('.mleh', {
      'mleh:move-cursor-down': () => this.mleh.moveCursorDown(),
      'mleh:move-cursor-up': () => this.mleh.moveCursorUp(),
      'core:cancel': () => this.toggle()
  }

  detach() {

  }

  destroy() {
    
  }

}

class ListItem extends Component {
  render() {
    return (
      <div className={this.props.class} id={this.props.id}>
        {this.props.command}
      </div>
    )
  }
}
