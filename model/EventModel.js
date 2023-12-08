import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDateTime: {
        type: Date,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    eventUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value);
            },
            message: 'Invalid URL format',
        },
    },
});

const EventModel = mongoose.model('Events', EventSchema);
export default EventModel;
