const i = require('electron').ipcRenderer;

let Ipc = {};

Ipc.install = Vue => {
    Vue.prototype.$ipc = i;
};

export default Ipc;
