export class InvalidColNumberError extends Error {
    private constructor(stack?: string) {
        super(stack);
    }

    public static withNumber(invalidValue: number): InvalidColNumberError {
        return new this(`${invalidValue} is not a valid column`);
    }
}
