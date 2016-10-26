'use babel';

import {filter, match} from 'fuzzaldrin-plus';
import View from './view';

export default class MlehOccur {
  constructor(buffers) {
    console.log("constructor of occur...");
    this.listResults = [];
    this.textEditor = atom.workspace.getActiveTextEditor();
    this.view = new View([]);

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
    let selectedOccur = this.view.list.getCurrent();
    console.log("Input:")
    console.log(selectedOccur);
	  atom.commands.dispatch(this.view.inputContainer ,"core:cancel");
  }

  getUpdatedList(input) {
    this.listResults = [];
    console.log("Input: " + input)
	  // TODO change this
    if (input.length < 3) {
      return [];
    }
    this.textEditor.scan(new RegExp(escape(input), "gi"), (obj) => {
      this.listResults.push({text: obj.lineText, row: obj.computedRange.start.row + 1});
    })
    let matching = this.listResults;
    console.log(matching);
    let updatedList = matching.map((item, index) => {
      return new ListItem({rawValue: item, value: item.text});
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

function escape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

class ListItem {
  constructor(item) {
	 this.item = item;
  }

  getInnerHTML(input) {
	 return atom.workspace.getActiveTextEditor().getTitle() + "::" + this.highlight(this.item, input) + "::" + this.item.rawValue.row.toString()
  }

  highlight(item, q) {
    reg = new RegExp(escape(q), "gi");
    let match = reg.exec(item.rawValue.text);
    console.log("reg:" + reg)
    console.log("text:" + item.rawValue.text);
    console.log(match);
//    return item.rawValue.text + " : " + item.rawValue.row;
    let text = item.rawValue.text;
    let newText = text.substring(0, match.index) + "<strong class='mleh-strong'>" +
                text.substring(match.index, match.index + q.length) + "</strong>" +
                text.substring(match.index + q.length, text.length);
    return newText;
  }
}
