import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
    userId: mongoose.Types.ObjectId;  // Reference to the User model
    message: string;
    read: boolean;
    timestamp: Date;
    link?: string;  // Optional link to the relevant page (e.g., job application page)
}

const NotificationSchema = new Schema<INotification>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    link: {
        type: String,
        default: "", // Optional link for deeper navigation
    },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
