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

    this.view = new View(this.getUpdatedList(""));

	 this.view.inputContainer.oninput = () => {
		console.log("updating view in command");
		let input = this.view.getInput();
		this.view.list.window = {
		  current: 0,
		  top: 0
		};
		this.view.list.currentInput = input;
		this.view.list.updateList(this.getUpdatedList(input))
		this.view.updateMeta();
	 }

	 this.view.highlight = this.highlight;
    

    //  Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    console.log(this.view == null ? "view is null": "view is not null");
    this.view.toggle();
    console.log(this.view == null ? "view is null": "view is not null");
  }

  attach() {
    this.subscriptions.add(atom.commands.add('.mleh', {
      'mleh:move-cursor-down': () => this.view.moveDown(),
      'mleh:move-cursor-up': () => this.view.moveUp(),
      'mleh:action-main': () => this.enter()
    }));
  }

  enter() {
    let command = this.view.list.getCurrent();
    console.log(command);	 
    atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), command.item.rawValue.name);
	 atom.commands.dispatch(this.view.inputContainer ,"core:cancel");
  }

  getUpdatedList(input) {
    let matching = this.commandList;
    if (input != "")
      matching = filter(this.commandList, input, {key: 'displayName'});
    let updatedList = matching.map((item, index) => {
      return new ListItem({rawValue: item, value: item.displayName});
    });
    return updatedList;
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


class ListItem {
  constructor(item) {
	 this.item = item;
  }

  getInnerHTML(input) {
	 return this.highlight(this.item.value, input)
  }

  // todo move to the view some how?
  highlight(str, q) {
    if (str == "" || q == "" || q == null || str == null)
      return str;
    console.log("query:  " + q);
    console.log("str  :  " + str);
    let matchPositions = match(str, q);
	 
	 console.log(matchPositions);
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
        output += "<strong class='mleh-strong'>";
        output += str.substring(strPos, matchPos);
        output += "</strong>";
        strPos = matchPos;
      }

    }
    output += str.substring(strPos);
	 console.log(output);
    return output;
  }
}
