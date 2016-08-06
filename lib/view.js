'use babel';

// TOOD
// Idea: use custom element instead of reactjs
// Another idea: use sliding window to only render elements that are in view
//    eliminates scrolling though
//    might make it a little more difficult to have variable size mleh window

export default class View {
  constructor(list, callback) {
    this.update = () => {};
    this.createContentContainer();
    this.panel = atom.workspace.addBottomPanel({
      item: this.contentContainer,
      visible: false,
      priority: "100"
    });
    this.meta = this.createMeta();
    this.listContainer = document.createElement("div");
    this.list = new List(this.listContainer, 20, list);
    //this.inputContainer = document.createElement("atom-text-editor");
    this.inputContainer = document.createElement("input");
    this.inputContainer.setAttribute("mini", "true");
    //this.inputContainer.setAttribute("onchange", print);
    this.inputContainer.onkeyup = (val) => {
      callback(val);
      //console.log(this.inputContainer.value);
    }
    this.inputContainer.setAttribute("class", "input-container");

    // add listContainer to panel
    this.contentContainer.appendChild(this.listContainer);
    // add meta line
    this.contentContainer.appendChild(this.meta);
    // add input
    this.contentContainer.appendChild(this.inputContainer);
  }

  print() {
    console.log(this.contentContainer.value);
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
    div.setAttribute("class", "info");
    return div;
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
    this.grandParent.setAttribute("class", "list-group");
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
    // console.log(this.filteredList);
    console.log(this.window);
    if (this.filteredList == null) {
      return;
    }
    let newParent = document.createElement("div");
    let len = this.windowLength;
    if (len > this.filteredList.length) {
      len = this.filteredList.length;
    }
    for (i = this.window.top; i < this.window.top + len + 1; i++) {
      let listItem = document.createElement("div");
      listItem.setAttribute("class", "list-item");
      listItem.innerHTML = this.filteredList[i].inner;

      // mark the current item
      if (i == this.window.current) {
        //listItem.style.class = "mleh-current";
	listItem.style.class = "mleh-selectedItem";
        listItem.style.backgroundColor =  "red";
      }
      // mark selected items
      if (this.selectedSet.get(this.filteredList[i].key) != null) {
        listItem.style.class = "mleh-selected";
        listItem.style.backgroundColor = "blue";
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
    if (this.window.current == this.window.top) {
      if (this.window.current == 0) {
        this.window.current = this.filteredList.length - 1;
        // if all the items fit in the window don't move it
        this.window.top = this.window.current < this.windowLength ? 0 : this.window.current - this.windowLength;
      } else {
        this.window.current = this.window.current - 1;
        this.window.top = this.window.current;
      }
    } else {
      this.window.current = this.window.current - 1;
    }

    this.render();
  }

  moveDown() {
    this.window.current = this.window.current + 1;
    // at bottom of window
    if (this.window.current > this.window.top + this.windowLength) {
      // bottom of list
      if (this.window.current > this.filteredList.length - 1) {
        this.window.current = 0;
        this.window.top = 0
      } else {
        //this.window.current = this.window.current + 1;
        this.window.top = this.window.current - this.windowLength;
      }
    } // else {
    //   this.window.current = this.window.current + 1;
    // }

    this.render();
  }

  getCurrent() {
    if (this.window.current < this.filteredList.length)
      return this.filteredList[this.window.current];
    else
      return null;
  }

  toggleSelected(i) {
    let selected = this.selectedSet.get(this.filteredList[i].key);
    if (selected == null) {
      this.selectedSet.set(this.filteredList[i].key, this.filteredList[i]);
    } else {
      this.selectedSet.delete(this.filteredList[i].key);
    }
  }
  
  getSelectedSet() {
    return this.selectedSet;
  }
  
  resetSelectedSet() {
    this.selectedSet = new Map();
  }
}


// class SaveBtn extends HTMLElement {

//   constructor() {
//     super();
//   } 
//   createdCallback(){
//     this.innerHTML = ""+
//       "   <style>                    "+
//       "       p { color: orange; }   "+
//       "     </style>                 "+  
//       "     <p>I'm in a custom element <span id='spn' style='color:blue'></span> the below button is with me as well :).</p> "+
//       "     <button id='btn'></button>   "+
//       "";
//     var spn = this.querySelector('span');
//     var btn = this.querySelector('button');
//     btn.addEventListener('click',() => alert('The button '+btn.textContent+' had been clicked'));
//   }


//   attachedCallback(){
//     this.querySelector('#spn').innerHTML = this.btntext != null ? this.btntext : this.dataset['text'];
//     this.querySelector('#btn').textContent = this.btntext != null ? this.btntext : this.dataset['text'];
//   }

//   set properties(prop) {
//     this.btntext = prop.text;
//   }

//   get text() {
//     return this.textContent;
//   } 
// }

// var MySaveBtn = document.registerElement("save-button", SaveBtn);

// var myBtn = new MySaveBtn;
// myBtn.properties={ text: 'Loaded from JavaScript' };  // or myBtn.text = 'click me';
// document.querySelector('#placeholder').appendChild(myBtn);
