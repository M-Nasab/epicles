import { epicles } from '../src/epicles';

describe('epicles', () => {
    it('Should have a `tick` method', () => {
        const epicle = epicles();

        expect(epicle).toHaveProperty('tick');
        expect(typeof epicle.tick).toBe('function');
    });

    it('Should have a `subscribe` method', () => {
        const epicle = epicles();

        expect(epicle).toHaveProperty('subscribe');
        expect(typeof epicle.subscribe).toBe('function');
    });

    it('Should return an `unsubscribe` method on subscription', () => {
        const epicle = epicles();

        const unsubscribe = epicle.subscribe(jest.fn());

        expect(typeof unsubscribe).toBe('function');
    });

    it('Should emit tick event on ticking', () => {
        const epicle = epicles({
            size: 5,
        });

        const mockSubscriber = jest.fn();
        epicle.subscribe(mockSubscriber);

        epicle.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);
        expect(mockSubscriber).toHaveBeenCalledWith([1, 0, 0, 0, 0]);

        epicle.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(2);
        expect(mockSubscriber).toHaveBeenCalledWith([2, 0, 0, 0, 0]);
    });

    it('Should unsubscribe work correctly', () => {
        const epicle = epicles();

        const mockSubscriber = jest.fn();
        const unsubscribe = epicle.subscribe(mockSubscriber);

        epicle.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);

        unsubscribe();

        epicle.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);
    });

    it('Should `size` argument work as expected', () => {
        const size = 5;
        const epicle = epicles({
            size,
        });

        const mockSubscriber = jest.fn();

        epicle.subscribe(mockSubscriber);

        // tick 5 times
        for (let i = 0; i < size; i++) {
            epicle.tick();
        }

        expect(mockSubscriber).nthCalledWith(1, [1, 0, 0, 0, 0]);
        expect(mockSubscriber).nthCalledWith(2, [2, 0, 0, 0, 0]);
        expect(mockSubscriber).nthCalledWith(3, [3, 0, 0, 0, 0]);
        expect(mockSubscriber).nthCalledWith(4, [4, 0, 0, 0, 0]);
        expect(mockSubscriber).nthCalledWith(5, [0, 1, 0, 0, 0]);
    });

    it('Should accept initial state', () => {
        const epicle = epicles({
            size: 3,
            initialState: [1, 2, 0],
        });
        const mockSubscriber = jest.fn();
        epicle.subscribe(mockSubscriber);

        epicle.tick();
        
        expect(mockSubscriber).nthCalledWith(1, [2, 2, 0]);

        epicle.tick();

        expect(mockSubscriber).nthCalledWith(2, [0, 0, 1]);
    });

    it('Should throw error if size is too small', () => {
        const create = () => {
            epicles({
                size: 1,
            });
        };

        expect(create).toThrow();
    });
});