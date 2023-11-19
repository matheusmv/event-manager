export class AsyncValidator {
    constructor(value) {
        this.value = value;
        this.predicates = [];
        this.success = true;
        this.issues = [];
    }

    static of(value) {
        return new AsyncValidator(value);
    }

    validateAsync(predicate) {
        this.predicates.push(predicate);
        return this;
    }

    async executeAsync() {
        for (const predicate of this.predicates) {
            const ok = await predicate(this.value, this.issues);
            if (!ok) {
                this.success = false;
            }
        }

        return { success: this.success, issues: this.issues };
    }
}
