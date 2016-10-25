'use babel';

import {filter, match} from 'fuzzaldrin-plus';
import View from './view';

export default class MlehBuffer {
  constructor(buffers) {
    console.log("constructor of buffers...");
    //this.commandList = atom.commands.findCommands({target: atom.views.getView(atom.workspace.getActiveTextEditor())});
	 // this.editors = atom.workspace.getTextEditors();
	 // console.log(this.editors);
	 this.items = this.getBufferNames();
	 //this.fileNames = this.getBufferNames();
    this.view = new View(this.getUpdatedList(""));

	 this.view.inputContainer.oninput = () => {
		console.log("updating view in occur");
		let input = this.view.getInput();
		this.view.list.window = {
		  current: 0,
		  top: 0
		};
		this.view.list.currentInput = input;
		this.view.list.updateList(this.getUpdatedList(input))
		this.view.updateMeta();
	 }

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
	 let current = this.view.list.getCurrent(); // get the value from input
	 let pane = atom.workspace.getActivePane(); // get the active pane
   pane.activateItemAtIndex(current.item.index); // activate input index
	 atom.commands.dispatch(this.view.inputContainer ,"core:cancel");
  }

  getUpdatedList(input) {
    let matching = this.items;
    if (input != "")
      matching = filter(this.items, input, {key: 'title'});
    let updatedList = matching.map((item, index) => {
      return new ListItem(item);
    });
    return updatedList;
  }

  getBufferNames() {
	 let items = atom.workspace.getPaneItems();
	 let newItems = items.map(function(item, index) {
		return {
		  title: item.getTitle(),
		  index: index
		}
	 })
	 return newItems;

	 // get buffers from atom workspace text editors
	 let buffers = atom.workspace.getTextEditors().map(function(editor) {
		console.log(editor);
		return editor.getTitle();
	 });
	 return buffers;
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
	 return this.highlight(this.item.title, input)
  }

  highlight(str, q) {

	 // TODO make simpler for occur
	 // no fuzzysearch

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
