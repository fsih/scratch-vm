const log = require('../util/log');

/**
 * @fileoverview
 * Stores profiling information.
 */

class PerformanceMetrics {
    constructor () {
        // Whether to log performance. Used for testing. Always off in prod.
        this._performanceMetricsOn = false;
        // Number of steps to take before printing a log. Logs the median values.
        // Set to 0 to aggregate forever.
        this._stepsBeforeLogging = 10;
        // Empty performance data (initial state)
        this._emptyData = {
            // Log of times it took to run _step
            stepTimes: [],
            // Number of steps done by sequencer where the work time was maxed out
            ticksWorkTimeReached: 0
        };
        // Set performance data
        this.reset();
    }

    reset () {
        this.data = Object.assign({}, this._emptyData);
        this.data.stepTimes = [];
    }

    addStepTime (stepTime) {
        if (!this._performanceMetricsOn) return;

        this.data.stepTimes.push(stepTime);
        if (this._stepsBeforeLogging > 0 && this.data.stepTimes.length >= this._stepsBeforeLogging) {
            this.printMetrics();
            this.reset();
        }
    }

    addWorkTimeReached () {
        if (!this._performanceMetricsOn) return;
        this.data.ticksWorkTimeReached++;
    }

    setStepsBeforeLogging (steps) {
        this._stepsBeforeLogging = steps;
    }

    turnOn () {
        //if (process.env.DEBUG) {
            this._performanceMetricsOn = true;
        //}
    }

    on () {
        return this._performanceMetricsOn;
    }

    printMetrics () {
        log.info('Step time: ' + this._findMedian(this.data.stepTimes).toFixed(2));
        if (this.data.ticksWorkTimeReached > 0) {
            log.info('Work time maxed: ' +
                this.data.ticksWorkTimeReached + '/' + this.data.stepTimes.length +
                ' (' + ((this.data.ticksWorkTimeReached * 100.0) / this.data.stepTimes.length) + '%)');
        }
    }

    /**
      * Finds a median.
      * @param {Array<number>} data Array of numbers to find median of
      * @return {number} the median of the list of numbers
      */
    _findMedian (data) {
        // extract the values and sort the resulting array
        const sorted = [...data].sort();

        const middle = Math.floor((sorted.length - 1) / 2);
        if (sorted.length % 2) {
            return sorted[middle];
        }
        return (sorted[middle] + sorted[middle + 1]) / 2.0;
    }
}

module.exports = PerformanceMetrics;
