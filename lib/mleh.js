'use babel';

import MlehView from './mleh-view';

export function provideMleh() {
  console.log("Mleh returned something!")
  return new MlehView();
}
