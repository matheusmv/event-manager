export function buildDTOWith(object, filters = []) {
    return Object.keys(object).reduce((dto, key) => {
        if (filters.includes(key)) {
            dto[key] = object[key];
        }

        return dto;
    }, {});
}
