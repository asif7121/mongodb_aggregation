import { Schema, model } from 'mongoose'

const moviesSchema = new Schema(
	{
		plot: {
			type: String,
			required: true,
		},
		genres: [String],
		runtime: Number,
		cast: [String],
		num_mflix_comments: Number,
		title: {
			type: String,
			required: true,
		},
		fullplot: {
			type: String,
			required: true,
		},
		countries: [String],
		released: {
			type:  Date,
			required: true,
		},
		directors: [String],
		rated: String,
		awards: {
			wins: Number,
			nominations: Number,
			text: String,
		},
		lastupdated: String,
		year: Number,
		imdb: {
			rating: Number,
			votes: Number,
			id: Number,
		},
		type: String,
		tomatoes: {
			viewer: {
				rating: Number,
				numReviews: Number,
				meter: Number,
			},
			lastUpdated:  Date,
		},
	},
    { collection: 'mflix_movies' },
    {
        timestamps: true
    }
)

export const Movie = model('Movie', moviesSchema)
