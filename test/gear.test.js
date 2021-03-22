import { createGear } from '../src/gear';

describe('Gear', () => {
    it('Should have a `tick` method', () => {
        const gear = createGear();

        expect(gear).toHaveProperty('tick');
        expect(typeof gear.tick).toBe('function');
    });

    it('Should have a `subscribe` method', () => {
        const gear = createGear();

        expect(gear).toHaveProperty('subscribe');
        expect(typeof gear.subscribe).toBe('function');
    });

    it('Should return an `unsubscribe` method on subscription', () => {
        const gear = createGear();

        const unsubscribe = gear.subscribe(jest.fn());

        expect(typeof unsubscribe).toBe('function');
    });

    it('Should emit tick event on ticking', () => {
        const gear = createGear();

        const mockSubscriber = jest.fn();
        gear.subscribe(mockSubscriber);

        gear.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);
        expect(mockSubscriber).toHaveBeenCalledWith(1);

        gear.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(2);
        expect(mockSubscriber).toHaveBeenCalledWith(2);
    });

    it('Should unsubscribe work correctly', () => {
        const gear = createGear();

        const mockSubscriber = jest.fn();
        const unsubscribe = gear.subscribe(mockSubscriber);

        gear.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);

        unsubscribe();

        gear.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);
    });

    it('Should `size` argument work as expected', () => {
        const size = 5;
        const gear = createGear(size);

        const mockSubscriber = jest.fn();

        gear.subscribe(mockSubscriber);

        // tick 5 times
        for (let i = 0; i < size; i++) {
            gear.tick();
        }

        expect(mockSubscriber).nthCalledWith(1, 1);
        expect(mockSubscriber).nthCalledWith(2, 2);
        expect(mockSubscriber).nthCalledWith(3, 3);
        expect(mockSubscriber).nthCalledWith(4, 4);
        expect(mockSubscriber).nthCalledWith(5, 0);
    });

    it('Should accept initial cursor position', () => {
        const gear = createGear(null, 3);
        const mockSubscriber = jest.fn();
        gear.subscribe(mockSubscriber);

        gear.tick(1);
        
        expect(mockSubscriber).toBeCalledWith(4);
    });

    it('Should throw error if size is too small', () => {
        const create = () => {
            createGear(1);
        };

        expect(create).toThrow();
    });

    it('Should handle cursor positions which are out of the range', () => {
        let gear = createGear(5, 6);
        let mockSubscriber = jest.fn();
        gear.subscribe(mockSubscriber);

        gear.tick(1);
        
        expect(mockSubscriber).toBeCalledWith(2);

        gear = createGear(5, -3);
        mockSubscriber = jest.fn();
        gear.subscribe(mockSubscriber);

        gear.tick(1);
        
        expect(mockSubscriber).toBeCalledWith(3);

    });
});