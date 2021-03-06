'use babel';

import MlehCommand from './command';
import MlehBuffer from './buffers';
import MlehOccur from './multi-occur'

const MODES = {
  FILE: 1,
  COMMAND: 2,
  OCCUR: 3,
};

export default class MlehController {
  constructor() {
    this.currentMode = null;
  }

  // TODO move these into the subscription if possible. may not be necesary
  togglecommand() {
    this.toggle(MODES.COMMAND);
  }

  togglefile() {
    this.toggle(MODES.FILE);
  }

  toggleoccur() {
    this.toggle(MODES.OCCUR);
  }

  togglebuffers() {
	 this.toggle(MODES.BUFFERS);
  }

  toggle(mode) {
    if (this.currentMode != null) {
      this.currentMode.detach();
      this.currentMode.destroy();
      this.currentMode = null;
      return;
    }

    switch (mode) {
    case MODES.COMMAND:
      this.currentMode = new MlehCommand();
      break;
    case MODES.FILE:
      this.currentMode = new MlehFiles();
      break;
    case MODES.OCCUR:
      this.currentMode = new MlehOccur();
      break;
	 case MODES.BUFFERS:
		this.currentMode = new MlehBuffer();
		break;
    default:
      break;
    }
    this.attach();
  }

  deactivate() {
    if (this.currentMode) {
      this.currentMode.destroy();
    }
  }

  destroy() {
  }

  detach() {
    // unsubscribe
    this.currentMode.detach();
    this.currentMode.destroy();
    // focus on active pane
    atom.workspace.getActivePane().activate();
  }

  attach() {
    if (this.currentMode != null)
      this.currentMode.attach(); // unsubscribe from commands?
  }

}
