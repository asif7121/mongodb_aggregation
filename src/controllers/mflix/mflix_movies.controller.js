import { Movie } from "../../models/mflix/mflix_movies.js";



export const filterMoviesByYear = async ( req, res ) => {
    try {
        const { year, startIndex = 1, perPage = 10 } = req.query;
        const skip = ( startIndex - 1 ) * perPage;
        if ( !year ) {
            return res.status(400).json({error: "Provide year to filter the movies"})
        }
        const movies = await Movie.aggregate([
			{
				$match: { year: parseInt(year) },
			},
			{
				$lookup: {
					from: 'mflix_comments',
					localField: '_id',
					foreignField: 'movie_id',
					as: 'comments',
				},
            },
            {
                $sort: {
                    title: 1,
                }
            },
            {
                $skip: skip
            },
            {
                $limit: parseInt(perPage),
            }
        ] )
        
        res.status( 200 ).json( {
            startIndex: +startIndex,
            perPage: +perPage,  
            data: movies
        })

    } catch (error) {
        console.log( error )
        res.status(500).json({error: error.message})
    }
}