const path = require('path');
const test = require('tap').test;
const attachTestStorage = require('../fixtures/attach-test-storage');
const extract = require('../fixtures/extract');
const VirtualMachine = require('../../src/index');

const uri = path.resolve(__dirname, '../fixtures/pen.sb2');
const project = extract(uri);

test('pen', t => {
    const vm = new VirtualMachine();
    attachTestStorage(vm);

    // Evaluate playground data and exit
    vm.on('playgroundData', () => {
        // @todo Additional tests
        t.end();
        process.nextTick(process.exit);
    });

    // Start VM, load project, and run
    t.doesNotThrow(() => {
        vm.start();
        vm.clear();
        vm.setCompatibilityMode(false);
        vm.setTurboMode(false);
        vm.loadProject(project).then(() => {
            vm.greenFlag();

            // After two seconds, get playground data and stop
            setTimeout(() => {
                vm.getPlaygroundData();
                vm.stopAll();
            }, 2000);
        });
    });
});
