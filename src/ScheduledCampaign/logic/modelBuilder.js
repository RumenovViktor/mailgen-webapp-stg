import moment from "moment";

export const modelBuilder = {
    getGeneralDetailsModel: (model) => {
        debugger
        return {
            name: model.name,
            emailTemplateId: model.emailTemplateId,
            enableOpenRate: model.enableOpenRate,
            enableClickTracking: model.enableClickTracking
        }
    },
    getSenderDetailsModel: (model) => {
        return {
            subject: model.subject,
            senderName: model.senderName,
            senderEmail: model.senderEmail,
        }
    },
    getSchedulingDetails: (model) => {
        const fullDate = moment(model.repeatTime);        
        return {
            date: fullDate.toString(),
            time: fullDate.toString()
        }
    }
}

export const { 
    getGeneralDetailsModel,
    getSenderDetailsModel,
    getSchedulingDetails
} = modelBuilder;