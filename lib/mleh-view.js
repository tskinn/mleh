'use babel';

import {filter, match} from 'fuzzaldrin-plus';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Infinite from 'react-infinite';


export default class MlehView {

  constructor(settings, list, onChange) {
    this.panel = null;
    // Create root element
    this.contentContainer = document.createElement('div');
    this.content = ReactDOM.render(
      <MlehContent settings={settings} list={list} inputChange={onChange}/>,
      this.contentContainer
    );
    this.createPanel();
    this.contentContainer.style.position = "relative";
    this.contentContainer.style.bottom = "0px";
  }

  updateList(list) {
    this.content.updateList(list);
  }

  createPanel(visible=false) {
    this.panel = atom.workspace.addBottomPanel({
      item: this.contentContainer,
      visible: visible,
      priority: "100"
    });
    return this.panel;
  }

  onDidClickOutside(callback) {

    // this.emitter.on('did-click-outside', callback);
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
      this.content.focus();
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

  moveCursorDown() {
    console.log("move down");
    this.content.setState((state, props) => {
      let index = this.content.state.selectedIndex;
      if (index === null || index === this.content.state.matchingItems.length - 1) {
        index = 0;
      } else {
        index++;
      }
      console.log(index);
      return {selectedIndex: index};
    });
  e = document.getElementById("selectedItem");
  e.scrollIntoView(false);
  }

  moveCursorUp() {
    console.log("move up");
    this.content.setState((state, props) => {
      let index = this.content.state.selectedIndex;
      if (index === null || index === 0) {
        index = this.content.state.matchingItems.length - 1;
      } else {
        index--;
      }
      console.log(index);
      return {selectedIndex: index};
    });
  e = document.getElementById("selectedItem");
  e.scrollIntoView(true);
  }
}

export class MlehContent extends Component {
  constructor(props) {
    super(props);
    console.log("mlehcontent props.list:");
    console.log(this.props.list);
    this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace)});
    this.state = {
      matchingItems: this.props.list,
      selectedIndex: 0
    };
  }

  updateList(list) {
    this.setState({matchingItems: list, selectedIndex: 0});
  }

  // this is old style; we ant to move logic out of view
  // updateList(text) {
  //   matching = filter(this.commandList, text, {key: 'displayName'});
  //   this.setState({matchingItems: matching, selectedIndex: 0})
  // }

  // TODO change this to send text to controller to update search instead of the view doing it
  handleInputChange(newText) {
    console.log("handling..." + newText);
    //this.updateList(newText);
    this.props.inputChange(newText);
    //this.setState({input: newText});
  }

  focus() {
    this.refs.mlehInput.focus();
  }

  render() {
    return (
      <div className="mleh">
        <MatchingList
          items={this.state.matchingItems}
          selectedI={this.state.selectedIndex}
        />
        <MlehInfo />
        <MlehInput
          ref="mlehInput"
          onChange={::this.handleInputChange}
        />
      </div>
    );
  }
}

export class MatchingList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      items,
      label,
      selectedI
    } = this.props;
    keys = items;
    console.log("keys:");
    console.log(keys);
    let listItems = keys.map((key, i) => {
      // TODO add logic to handle various list item objects
      // like list-item with a label and icon or list item with just a label etc
      if (i == selectedI) {
        return ( <ListItem class="list-item selected" path={key.displayName} id="selectedItem" />);
      } else {
        return ( <ListItem class="list-item" path={key.displayName} />);
      }
    });
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
      // TODO similar to list-item
      // add logic to handle whatever the meta date controller wants to display
        heres info
      </div>
    );
  }
}

export class ListItem extends Component {

  render() {
    return (
      <div className={this.props.class} id={this.props.id}>
        { this.props.label ? <ListItemLabel path={this.props.path} />
        : "" }
        {this.props.path}
      </div>
    )
  }
}

export class SelectedListItem extends Component {
  render() {
    return (
      <div className="list-item selected" id="selectedItem">
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
    console.log("focusing");
    this.refs.textEditor.focus();
  }

  componentDidMount() {
    this.textEditor = this.refs.textEditor.getModel();
    this.textEditor.onDidChange(::this.handleChange);
    this.refs.textEditor.focus();
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
