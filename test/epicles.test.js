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
            steps: 5,
            steppers: 5,
        });

        const mockSubscriber = jest.fn();
        epicle.subscribe(mockSubscriber);

        epicle.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);
        expect(mockSubscriber).toHaveBeenCalledWith([{
            step: 1,
            stepper: 0,
        }]);

        epicle.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(2);
        expect(mockSubscriber).toHaveBeenCalledWith([{
            step: 2,
            stepper: 0,
        }]);
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

    it('Should `steps` argument work as expected', () => {
        const steps = 5;
        const steppers = 5;
        const epicle = epicles({
            steps,
            steppers,
        });

        const mockSubscriber = jest.fn();

        epicle.subscribe(mockSubscriber);

        // tick 5 times
        for (let i = 0; i < steps; i++) {
            epicle.tick();
        }

        expect(mockSubscriber).nthCalledWith(1, [{
            step: 1,
            stepper: 0,
        }]);
        expect(mockSubscriber).nthCalledWith(2, [{
            step: 2,
            stepper: 0,
        }]);
        expect(mockSubscriber).nthCalledWith(3, [{
            step: 3,
            stepper: 0,
        }]);
        expect(mockSubscriber).nthCalledWith(4, [{
            step: 4,
            stepper: 0,
        }]);
        expect(mockSubscriber).nthCalledWith(5, [
            {
                step: 0,
                stepper: 0,
            },
            {
                step: 1,
                stepper: 1,
            }
        ]);
    });

    it('Should accept initial state', () => {
        const epicle = epicles({
            steps: 3,
            steppers: 3,
            initialState: [1, 2, 0],
        });

        const mockSubscriber = jest.fn();
        epicle.subscribe(mockSubscriber);

        epicle.tick();
        
        expect(mockSubscriber).nthCalledWith(1, [{
            step: 2,
            stepper: 0,
        }]);

        epicle.tick();

        expect(mockSubscriber).nthCalledWith(2, [
            {
                step: 0,
                stepper: 0,
            },
            {
                step: 0,
                stepper: 1,
            },
            {
                step: 1,
                stepper: 2,
            }
        ]);
    });

    it('Should throw error if size is too small', () => {
        const create = () => {
            epicles({
                steps: 1,
            });
        };

        expect(create).toThrow();
    });
});