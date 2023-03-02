export class InvalidRowNumberError extends Error {
    private constructor(stack?: string) {
        super(stack);
    }

    public static withNumber(invalidValue: number): InvalidRowNumberError {
        return new this(`${invalidValue} is not a valid row`);
    }
}
