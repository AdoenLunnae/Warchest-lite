export class InvalidRowLetterError extends Error {
    private constructor(stack?: string) {
        super(stack);
    }

    public static withString(invalidValue: string): InvalidRowLetterError {
        return new this(`${invalidValue} is not a valid row letter`);
    }
}
