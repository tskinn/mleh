'use babel';

// TOOD
// Idea: use custom element instead of reactjs
// Another idea: use sliding window to only render elements that are in view
//    eliminates scrolling though
//    might make it a little more difficult to have variable size mleh window

export class view {
  let filteredList[];

  let grandParent = document.getElementByID("grandParent");
  let parent = document.createElement("div");

  constructor(wrapperElement) {
	 this.grandParent = wrapperElement;
	 this.selected = {};
	 this.window = {
		current: 0,
		top: 0,
		length: 30
	 };
	 this.parent = document.createElement("div");
  }

  render(window) {
    let newParent = document.createElement("div");
    let len = window.length;
    if (len > filteredList.length) {
      len = filteredList.length;
    }
    for (i = window.top; i < len; i++) {
      let listItem = document.createElement("div");
      listItem.innerHTML = filteredList[i].inner;

      // mark the current item
      if (i == window.current) {
        listItem.style.class = "mleh-current";
      }
      // mark selected items
      if (selected[filteredList[i].key] != null) {
        listItem.style.class = "mleh-selected";
      }
      newParent.appendChild(listItem);
    }

    // destroy parent so it can be replaced
    grandParent.destroyChildren(); // ??

    // put the list items back in the main div
    grandParent.appendChild(newParent);
  }

  moveUp() {
    if (window.current == window.top) {
      if (window.current == 0) {
        window.current = filteredList.length - 1;
        window.top = window.current - window.length < 0 ? 0 : window.current - window.length;
      } else {
        window.current = window.current - 1;
        window.top = window.current;
      }
    } else {
      window.current = window.current - 1;
    }

    render(window);
  }

  moveDown() {

    // at bottom of window
    if (window.current == window.top + window.length) {
      // bottom of list
      if (window.current == filteredList.length - 1) {
        window.current = 0;
        window.top = 0
      } else {
        window.current = window.current + 1;
        window.top = window.current;
      }
    } else {
      window.current = window.current + 1;
    }

    render(window);
  }
}

class Content extends HTMLElement {
  constructor(inner) {
	 this.inner = inner;
  }
  createdCallback() {
	 this.innerHTML = this.inner;
  }
  // createdCallback() {}
  // attachedCallback() {}
  // detachedCallback() {}
  // attributeChangedCallback() {}

}

class SaveBtn extends HTMLElement {

  constructor() {
    super();
  } 
  createdCallback(){
    this.innerHTML = ""+
      "   <style>                    "+
      "       p { color: orange; }   "+
      "     </style>                 "+  
      "     <p>I'm in a custom element <span id='spn' style='color:blue'></span> the below button is with me as well :).</p> "+
      "     <button id='btn'></button>   "+
      "";
    var spn = this.querySelector('span');
    var btn = this.querySelector('button');
    btn.addEventListener('click',() => alert('The button '+btn.textContent+' had been clicked'));
  }


  attachedCallback(){
    this.querySelector('#spn').innerHTML = this.btntext != null ? this.btntext : this.dataset['text'];
    this.querySelector('#btn').textContent = this.btntext != null ? this.btntext : this.dataset['text'];
  }

  set properties(prop) {
    this.btntext = prop.text;
  }

  get text() {
    return this.textContent;
  } 
}

var MySaveBtn = document.registerElement("save-button", SaveBtn);

var myBtn = new MySaveBtn;
myBtn.properties={ text: 'Loaded from JavaScript' };  // or myBtn.text = 'click me';
document.querySelector('#placeholder').appendChild(myBtn);
