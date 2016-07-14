'use babel';

import {filter, match} from 'fuzzaldrin-plus';
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
  }
}

export class MlehContent extends Component {
  constructor(props) {
    super(props);
    this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace)});
    this.state = {
      matchingItems: atom.commands.findCommands({target: atom.views.getView(atom.workspace)}),
      selectedIndex: 0
    };
  }

  // getInitalState() {
  //   items = Object.keys(atom.commands.registeredCommands);
  //   return {selected: null, matchingItems: items};
  // }

  updateList(text) {
    matching = filter(this.commandList, text, {key: 'displayName'});
    this.setState({matchingItems: matching, selected: 0})
  }

  handleInputChange(newText) {
    console.log("handling...");
    this.updateList(newText);
    //this.setState({input: newText});
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
    let listItems = keys.map((key, i) => {
      if (i == selectedI) {
        return ( <SelectedListItem path={key.displayName} />);
      } else {
        return ( <ListItem path={key.displayName} />);
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

export class SelectedListItem extends Component {
  render() {
    return (
      <div className="list-item selected">
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
