'use babel';

import {filter, match} from 'fuzzaldrin-plus';
import MlehView from './mleh-view';
import {Component} from 'react';

export default class MlehCommand {
  constructor() {
    console.log("constructor of command...");
    settings = {};
    // get list of commands to filter through
    //this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace.getActivePane())});
    // or
    this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace.getActiveTextEditor())});
    this.view = new MlehView(settings, this.commandList, (input) => {
      console.log("controller: updateInput: " + input);
      if (this.view == null) {
        console.log("view is null!");
        return;
      }
      this.view.updateList(this.getUpdatedList(input));
    });

  //  Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    console.log(this.view == null ? "view is null": "view is not null");
    this.view.toggle();
    console.log(this.view == null ? "view is null": "view is not null");
  }

  attach() {
    this.subscriptions.add(atom.commands.add('.mleh', {
      'mleh:move-cursor-down': () => this.view.moveCursorDown(),
      'mleh:move-cursor-up': () => this.view.moveCursorUp(),
      'core:cancel': () => this.view.toggle()
    }));
  }

  updateInput(input) {
    console.log("controller: updateInput: " + input);
    if (this.view == null) {
      console.log("view is null!");
      return;
    }
    this.view.updateList(this.getUpdatedList(input));
  }

  getUpdatedList(input) {
    let matching = filter(this.commandList, input, {key: 'displayName'});
    return matching;
  }

  highlight(str, query) {
    let matchPositions = match(str, query);
    if(!matchPositions || matchPositions.length == 0) return str;
    let output = "";
    let matchIndex = -1;
    let strPos = 0;

    while (++matchIndex < matchPositions.length) {
      let matchPos = matchPositions[matchIndex];

      if (matchPos > strPos) {
        output += str.substring(strPos, matchPos);
        strPos = matchPos;
      }

      while (++matchIndex < matchPositions.length) {
        if (matchPositions[matchIndex] == matchPos + 1) {
          matchPos++;
        } else {
          matchIndex--;
          break;
        }
      }

      matchPos++;
      if (matchPos > strPos) {
        output += "<strong>";
        output += str.substring(strPos, matchPos);
        output += "</strong>";
        strPos = matchPos;
      }

    }
    output += str.substring(strPos);
    return output;
  }

  destroyatch() {
    this.detach();
    this.destroy();
  }

  detach() {
    console.log("detaching vew.")
    this.subscriptions.dispose();
  }

  destroy() {
    console.log("destroying view.destroy()");
    this.view.destroy();
  }

}
