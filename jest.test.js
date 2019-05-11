const log = require('debug')('jest-test');

log.enabled = true;

describe('jest test describe', () => {
    it('jest it 1', () => {
        process.stdout.write('This is the system out\n');
        log('This is the debug logging');
        console.log('This is console log');
        expect(1).toEqual(1);
    });
    
    it('jest it 2', () => {
        process.stdout.write('This is the system out\n');
        expect(2).toEqual(1);
    });
})