'use babel';

import {filter, match} from 'fuzzaldrin-plus';
import View from './view';

export default class MlehCommand {
  constructor() {
    console.log("constructor of command...");
    // get list of commands to filter through
    //this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace.getActivePane())});
    // or
    this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace.getActiveTextEditor())});

    this.view = new View(this.getUpdatedList(""), this.onChange);
    this.view.inputContainer.onblur = () => {
      // cancel this thing
      atom.commands.dispatch(this.view.inputContainer ,"core:cancel");
    }
    

    //  Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    console.log(this.view == null ? "view is null": "view is not null");
    this.view.toggle();
    console.log(this.view == null ? "view is null": "view is not null");
  }

  onChange() {
    if (this.view == null || this.view.list == null)
      return;
    console.log("updating view in command");
    let current = this.view.list.getCurrent();
    let str = ""
    if (current != null)
      str = current.key;
    this.view.list.updateList(this.getUpdatedList(str))
  }

  attach() {
    this.subscriptions.add(atom.commands.add('.mleh', {
      'mleh:move-cursor-down': () => this.view.list.moveDown(),
      'mleh:move-cursor-up': () => this.view.list.moveUp(),
      'mleh:action-main': () => this.enter()
    }));
  }

  enter() {
    console.log("enter");
    let command = this.view.inputContainer.getCurrent();
    atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), command.key);
  }

  getUpdatedList(input) {
    let matching = this.commandList;
    if (input != "")
      matching = filter(this.commandList, input, {key: 'displayName'});
    let updatedList = matching.map((item, index) => {
      let innnerHTML = "<div>" + this.highlight(item.displayName, input) + "</div>";
      if (input == "")
	innerHTML = "<div>" + item.displayName + "</div>";
      return {key: item.displayName, inner: innerHTML, value:item}
    });
    return updatedList;
  }

  highlight(str, q) {
    if (str == "" || q == "" || q == null || str == null)
      return str;
    console.log("query:  " + q);
    console.log("str  :  " + str);
    let matchPositions = match(str, q);
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
