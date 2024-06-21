import { Schema, model } from "mongoose";


const theaterSchema = new Schema(
	{
		theaterId: {
			type: Number,
			required: true,
		},
		location: {
			address: {
				street1: String,
				city: String,
				state: String,
				zipcode: String,
			},
			geo: {
				type: {
					type: String,
					enum: ['Point'],
					required: true,
				},
				coordinates: {
					type: [Number],
					required: true,
				},
			},
		},
	},
	{ collection: 'mflix_theaters' },
	{
		timestamps: true,
	}
)
theaterSchema.index( { 'location.geo.coordinates': '2dsphere' } )

export const Theater = model('Theater',theaterSchema)