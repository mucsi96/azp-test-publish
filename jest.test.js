describe('jest test describe', () => {
    it('jest it 1', () => {
        process.stdout.write('This is the system out\n');
        process.stderr.write('This is the system error\n');
        console.log('This is console log');
        expect(1).toEqual(1);
    });

    it('jest it 2', () => {
        expect(2).toEqual(1);
    });
})