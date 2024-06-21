import databaseHelper from '../../helpers/database.helper.js'
import { Theater } from '../../models/mflix/mflix_theaters.js'

export const searchThearterList = async (req, res) => {
	try {
        const { lon, lat, radius, startIndex = 1, perPage = 10 } = req.query
        
        const skip = (startIndex - 1) * perPage
		if (!lat || !lon) {
			return res.status(400).json({ error: 'Latitude and Longitude are required' })
		}
        
        const maxDistance = ( radius ? parseFloat( radius ) : 10 ) * 1000 // distance is km in meter
        
           
		 const theaters = await Theater.aggregate([
				{
					$geoNear: {
						near: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
						distanceField: 'distance',
						maxDistance: maxDistance,
						spherical: true,
					},
             },
             {
                 $sort: {
                     distance: 1,
                 }
             },
             {
                 $skip: skip
             },
             {
                 $limit: perPage
             }
         ] )

        res.status( 200 ).json( {
            startIndex: +startIndex,
            perPage: +perPage,
            total: await Theater.countDocuments(),
            data: theaters
        })
    } catch ( error ) {
        console.error( error )
		res.status(500).json({ error: error.message })
	}
}
