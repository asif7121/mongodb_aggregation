import { Schema, model } from "mongoose";


const commentSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		movie_id: {
			type: Schema.Types.ObjectId,
			ref: 'Movie',
		},
		text: {
			type: String,
			required: true,
		},
		date:  Date
	},
	{ collection: 'mflix_comments' }
)


export const Comment = model('Comment',commentSchema)