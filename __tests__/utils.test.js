const {
    monthFormat,
    dayFormat,
    hourFormat,
    dateFormat
} = require('../utils/dateFormat');

describe('Utility Test Suite', () => {
    describe('dateFormat', () => {
        test('converts timestamp to formatted string', async () => {
            const timestamp = Date.now();
            const dateObj = new Date(timestamp);
            const stringArr = dateFormat(timestamp).split(' ');
            const timeArr = stringArr[4].split(':');

            // month
            expect(stringArr[0]).toEqual(monthFormat(dateObj.getMonth()));
            // day
            expect(stringArr[1]).toEqual(`${dayFormat(dateObj.getDate())},`);
            // year
            expect(stringArr[2]).toEqual(`${dateObj.getFullYear()}`);
            // at
            expect(stringArr[3]).toEqual('at');
            // hours
            expect(timeArr[0]).toEqual(`${hourFormat(dateObj.getHours())}`);
            // minutes
            expect(timeArr[1]).toEqual((dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes());
            // designation
            expect(stringArr[5]).toEqual(dateObj.getHours() >= 12 ? 'pm' : 'am');
        });
    })
})