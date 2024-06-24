import databaseHelper from '../../helpers/database.helper.js'
import { Movie } from '../../models/mflix/mflix_movies.js'

export const filterMoviesByYear = async (req, res) => {
	try {
		const { year, startIndex = 1, itemsPerPage = 10 } = req.query
		const skip = (startIndex - 1) * itemsPerPage
		if (!year) {
			return res.status(400).json({ error: 'Provide year to filter the movies' })
		}
        const query = [
			databaseHelper.GenerateMatchQuery({ year: parseInt(year) }),
			databaseHelper.GenerateLookup('mflix_comments', '_id', 'movie_id', 'comments',)[0],
        ]
        
        const options = {
			startIndex: +startIndex,
			itemsPerPage: +itemsPerPage,
			projection: {
				_id: 1,
				title: 1,
				plot: 1,
				genres: 1,
				year: 1,
				runtime: 1,
				rated: 1,
				num_mflix_comments: 1,
				fullplot: 1,
				cast: 1,
				countries: 1,
				released: 1,
				directors: 1,
				awards: 1,
				imdb: 1,
				type: 1,
				lastupdated: 1,
				tomatoes: 1,
				comments: 1,
			},
			query,
			sortObj: { title: 1 },
		}
        const response = await databaseHelper.GenerateQueryWithPagination( options, Movie )
        return res.status(200).json({...response})
	
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: error.message })
	}
}
