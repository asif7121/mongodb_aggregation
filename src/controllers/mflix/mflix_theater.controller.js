import databaseHelper from '../../helpers/database.helper.js'
import { Theater } from '../../models/mflix/mflix_theaters.js'
import dotenv from 'dotenv'
dotenv.config()

const defaultRange = +process.env.DEFAULT_RANGE
export const searchThearterList = async (req, res) => {
	try {
		const { lon, lat, radius, startIndex = 1, itemsPerPage = 10 } = req.query

		if (!lat || !lon) {
			return res.status(400).json({ error: 'Latitude and Longitude are required' })
		}
		const maxDistance = (radius ? parseInt(radius) : parseInt(defaultRange)) * 1000 // distance is km in meter
        const query = [
			databaseHelper.GenerateGeoQuery({
				near: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
				distanceField: 'distance',
				maxDistance: maxDistance,
				spherical: true,
			}),
        ]
        const options = {
			startIndex: +startIndex,
			itemsPerPage: +itemsPerPage,
			query,
			projection: {
				theaterId: 1,
				'location.address': 1,
				distance: 1,
				totalCount: 1,
            },
            sortObj: {distance:1}
        }
        const response = await databaseHelper.GenerateQueryWithPagination( options, Theater )
        
       return res.status(200).json({...response})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
