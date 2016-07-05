'use babel';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Infinite from 'react-infinite';


export default class MlehView {

  constructor(serializedState) {
    // Create root element
    this.contentContainer = document.createElement('div');
    this.content = ReactDOM.render(
      <MlehContent />,
      this.contentContainer
    );
  }

  createPanel(visible=true) {
    let panel = atom.workspace.addBottomPanel({
      item: this.contentContainer,
      visible: visible,
      priority: 100});


    return panel;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}

export class MlehInput extends Component {
  constructor(props) {
    super(props);
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

export class MlehContent extends Component {
  constructor(props) {
    super(props);
    this.itemHeight = null;
    this.maxListHeight = null;

  }

  render() {
    return (
      <div className="mleh">
        Here it is!
        <MatchingList />
        <MlehInfo />
        <MlehInput />
      </div>
    );
  }
}

export class MatchingList extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    // let listItems = matchingPaths.map(path => (
    //   <ListItem />
    // ));
    return (
      <div className="list-group" ref="listGroup">
          <ListItem path="first/path"></ListItem>
          <ListItem path="second/path"></ListItem>
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
        <ListItemLabel path={this.props.path} />
        {this.props.path}
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
