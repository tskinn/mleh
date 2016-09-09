'use babel';

export default class View {
  constructor(list) {
    this.update = () => {};
    this.createContentContainer();
    this.panel = atom.workspace.addBottomPanel({
      item: this.contentContainer,
      visible: false,
      priority: "100"
    });
    this.meta = this.createMeta();
    this.listContainer = document.createElement("div");
    this.list = new List(this.listContainer, 18, list);
    this.inputContainer = document.createElement("input");
    this.inputContainer.setAttribute("class", "mleh-input-container");
	 this.inputContainer.onblur = () => {
		// quit
		atom.commands.dispatch(this.inputContainer ,"core:cancel");
	 }
    // add listContainer to panel
    this.contentContainer.appendChild(this.listContainer);
    // add meta line
    this.contentContainer.appendChild(this.meta);
    // add input
    this.contentContainer.appendChild(this.inputContainer);
	 this.updateMeta();
  }

  print() {
    console.log(this.contentContainer.value);
  }

  getInput() {
	 return this.inputContainer.value;
  }
  
  createContentContainer() {
    let container = document.createElement("div");
    container.style.position = "relative";
    container.style.bottom = "0px";
    container.setAttribute("id", "mleh-content-container");
    container.setAttribute("class", "mleh native-key-bindings");
    this.contentContainer = container;
  }

  createMeta() {
    let div = document.createElement("div");
    div.setAttribute("id", "mleh-meta");
    div.setAttribute("class", "mleh-info");
    return div;
  }

  updateMeta() {
	 this.meta.innerHTML = (this.list.window.current + 1) + " of " + this.list.filteredList.length;
  }

  moveUp() {
	 this.list.moveUp();
	 this.updateMeta();
  }

  moveDown() {
	 this.list.moveDown();
	 this.updateMeta();
  }
  
  toggle() {
    console.log("new toggle view");
    if (this.panel == null)
      return;
    if (this.panel.isVisible()) {
      this.panel.hide();
    } else {
      this.panel.show();
      this.inputContainer.focus();
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

export class List {
  constructor(wrapperElement, length = 20, list = []) {
    this.grandParent = wrapperElement;
    this.grandParent.setAttribute("class", "mleh-list-group");
    this.windowLength = length;
    this.grandParent = wrapperElement;
    this.filteredList = list;
    this.selectedSet = new Map();
    this.window = {
      current: 0,
      top: 0
    };
    this.parent = document.createElement("div");
    this.grandParent.appendChild(this.parent);
	 this.currentInput;
    this.render();
  }

  updateList(newList) {
    this.filteredList = newList;
    this.window = {current: 0, top: 0};
    this.render();
  }

  getSelected() {
    return this.selectedSet;
  }
  
  render() {
    //console.log(this.filteredList);
    console.log(this.window);
	 console.log("length: " + this.windowLength)
    if (this.filteredList == null) {
      return;
    }
    let newParent = document.createElement("div");
    let len = this.windowLength;
    if (len > this.filteredList.length) {
      len = this.filteredList.length;
    }
    for (i = this.window.top; i < this.window.top + len; i++) {
		if (this.filteredList[i] == null)
		  console.log("undefined at: " + i)
		
      let listItem = document.createElement("div");      
      listItem.innerHTML = this.filteredList[i].getInnerHTML(this.currentInput);

      // mark the current item
      if (i == this.window.current) {
        //listItem.style.class = "mleh-current";
		  // listItem.style.class = "mleh-selectedItem";
		  listItem.setAttribute("class", "mleh-list-item mleh-current-item");
        // listItem.style.backgroundColor =  "red"; 
      }
      // mark selected items
      if (this.selectedSet.get(this.filteredList[i].value) != null) {
		  listItem.setAttribute("class", "mleh-list-item mleh-selected-item");
        // listItem.style.class = "mleh-selected";
        // listItem.style.backgroundColor = "blue";
      }
      newParent.appendChild(listItem);
    }

    // destroy parent so it can be replaced
    this.grandParent.removeChild(this.parent);
    this.parent = newParent;
    
    // put the list items back in the main div
    this.grandParent.appendChild(newParent);
  }

  moveUp() {
    this.window.current = this.window.current - 1;
	 // at top of list
	 if (this.window.current < 0) {
		this.window.current = this.filteredList.length - 1;
		// list length less than window
		if (this.window.current - this.windowLength + 1 < 0)
		  this.window.top = 0;
		else
		  this.window.top = this.window.current - this.windowLength + 1;
	 } else if (this.window.current < this.window.top) {
		this.window.top = this.window.current;
	 }
	 
    this.render();
  }

  moveDown() {
    this.window.current = this.window.current + 1;

	 // current out of range of list
	 if (this.window.current > this.filteredList.length - 1) {
		this.window.current = 0;
		this.window.top = 0;
	 // current out of range of window
	 } else if (this.window.current >= this.window.top + this.windowLength) {
		this.window.top = this.window.current - this.windowLength + 1;
	 }

    this.render();
  }

  getCurrent() {
    if (this.window.current < this.filteredList.length)
      return this.filteredList[this.window.current];
    else
      return null;
  }

  toggleSelected(i) {
    let selected = this.selectedSet.get(this.filteredList[i].value);
    if (selected == null) {
      this.selectedSet.set(this.filteredList[i].value, this.filteredList[i]);
    } else {
      this.selectedSet.delete(this.filteredList[i].value);
    }
  }
  
  getSelectedSet() {
    return this.selectedSet;
  }
  
  resetSelectedSet() {
    this.selectedSet = new Map();
  }
}
