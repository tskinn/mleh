'use babel';

import Fuse from 'fuse.js';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Infinite from 'react-infinite';


export default class MlehView {

  constructor() {
    this.panel = null;
    // Create root element
    this.contentContainer = document.createElement('div');
    this.content = ReactDOM.render(
      <MlehContent />,
      this.contentContainer
    );
  }

  createPanel(visible=false) {
    this.panel = atom.workspace.addBottomPanel({
      item: this.contentContainer,
      visible: visible,
      priority: "100"
    });
    return this.panel;
  }

  toggle() {
    console.log("mleh toggling...")
    if (this.panel == null) {
      return;
    }
    if (this.panel.isVisible()) {
      this.panel.hide();
    } else {
      this.panel.show();
    }
  }

  // Tear down any state and detach
  destroy() {
    if (this.panel == null) {
      return;
    }
    this.panel.destroy();
    this.panel = null;
    atom.workspace.getActivePane().activate();
  }
}

export class MlehContent extends Component {
  constructor(props) {
    super(props);
    this.itemHeight = null;
    this.maxListHeight = null;
    // this.commands = Object.keys(atom.commands.registeredCommands).map(function (key) {
    //   return atom.commands.registeredCommands[key];
    // });
    this.commands = Object.keys(atom.commands.registeredCommands);
    console.log("keys");
    console.log(this.commands);
    this.items = this.commands;
  }

  updateList(text) {
    console.log("fusing...");
    console.log(this.commands);
    f = new Fuse(this.commands);
    this.items = f.search(text);
    console.log(this.items);
  }

  handleInputChange(newText) {
    console.log("handling...");
    this.updateList(newText);
    this.setState({input: newText});
  }

  render() {
    return (
      <div className="mleh">
        <MatchingList items={this.items} />
        <MlehInfo />
        <MlehInput
          onChange={::this.handleInputChange}
        />
      </div>
    );
  }
}

export class MatchingList extends Component {
  constructor(props) {
    super(props);
    this.listCommands = Object.keys(atom.commands.registeredCommands);
  }

  render() {
    let {
      items,
      label
    } = this.props;
    keys = items;
    console.log("this is in render:");
    console.log(keys);
    let listItems = keys.map(key => (
      <ListItem path={this.listCommands[key]} />
    ));
    return (
      <div className="list-group" ref="listGroup">
          {listItems}
      </div>
    )
  }
}

export class MlehInfo extends Component {
  render() {
    return (
      <div className="info">
        heres info
      </div>
    );
  }

}

export class ListItem extends Component {
  render() {
    return (
      <div className="list-item">
        { this.props.label ? <ListItemLabel path={this.props.path} />
        : "" }
        {this.props.path}
      </div>
    )
  }
}

export class MlehInput extends Component {
  constructor(props) {
    super(props);
  }

  focus() {
    this.refs.textEditor.focus();
  }

  componentDidMount() {
    this.textEditor = this.refs.textEditor.getModel();
    this.textEditor.onDidChange(::this.handleChange);
  }

  handleChange() {
    this.props.onChange(this.textEditor.getText());
  }

  render() {
    return (
      <div className="input-container">
        <atom-text-editor
          ref="textEditor"
          class="mleh-input"
          placeholder-text="start typing"
          mini
        />
      </div>
    )
  }
}

export function ListItemLabel({path}) {
  return (
    <span className="list-item-label icon icon-octoface">
    </span>
  );
}
