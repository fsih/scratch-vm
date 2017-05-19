const path = require('path');
const test = require('tap').test;
const attachTestStorage = require('../fixtures/attach-test-storage');
const extract = require('../fixtures/extract');
const VirtualMachine = require('../../src/index');
const log = require('../../src/util/log');

const uri = path.resolve(__dirname, '../fixtures/control.sb2');
const project = extract(uri);

test('control', t => {
    const vm = new VirtualMachine();

    let finish = function () {
        vm.getPlaygroundData();
        vm.stopAll();
    };

    vm.runtime.performance.turnOn(true);
    vm.runtime.performance.callbackAfterNumSteps(finish, 200);
    attachTestStorage(vm);

    // Evaluate playground data and exit
    vm.on('playgroundData', e => {
        const threads = JSON.parse(e.threads);
        t.ok(threads.length > 0);
        t.end();
        log.info('\nControl:\n');
        vm.runtime.performance.printMetrics();
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
        });
    });
});
