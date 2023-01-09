export const scheduledCampaignsValidations = {
    validateStringLength: (name, length) => {
        const definedLength = length ? length : 3
        return name.length && name.length > definedLength;
    },
    stringNotNull: (str) => {
        return str && str.length && str.length > 0;
    }
}

export const {
    validateStringLength,
    stringNotNull
} = scheduledCampaignsValidations;