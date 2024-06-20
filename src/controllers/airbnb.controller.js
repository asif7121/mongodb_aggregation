import databaseHelper from '../helpers/database.helper.js'
import { Airbnb } from '../models/airbnb.js'
import moment from 'moment'
import _ from 'lodash'

export const getPropertyType = async (req, res) => {
  try {
    const {  startIndex = 1, itemsPerPage = 10 } = req.query
    
    const query = [
      databaseHelper.GenerateGroupQuery( { _id: '$property_type', total: { $count: {} } } ),
    ]

  const options = {
		startIndex: +startIndex,
		itemsPerPage: +itemsPerPage,
    projection: {
      _id:1,
      total:1,
		},
    query,
    sortObj:{_id:1}
  }
  const response = await databaseHelper.GenerateQueryWithPagination(options, Airbnb)
  return res.json({ ...response })
  } catch (error) {
		console.log('Error : ', error)
		res.status(500).json({ error: error.message })
	}
}

export const searchProperty = async (req, res) => {
	const {
		property_type,
		accommodates,
		startIndex = 1,
		itemsPerPage = 10,
		start_date,
    end_date,
    search
	} = req.query

	if (!property_type) {
		return res.status(422).json({ message: 'Property type is required.' })
	}
  let dateDifference;
  let query = [];

	if (start_date && end_date) {
		const startDate = moment(start_date, 'YYYY-MM-DD')
		const endDate = moment(end_date, 'YYYY-MM-DD')
		if (startDate.isAfter(endDate)) {
			return res.status(400).json({
				message: 'start_date cannot be greater than end_date',
			})
		}

		if (!startDate.isValid() || !endDate.isValid()) {
			return res.status(200).json({ message: 'Invalid date format. Use YYYY-MM-DD.' })
		}

		const today = moment().startOf('day')
		if (startDate.isBefore(today) || endDate.isBefore(today)) {
			return res.status(200).json({ message: 'Dates cannot be in the past.' })
		}

		dateDifference = endDate.diff(startDate, 'days')

    query.push(
		databaseHelper.GenerateMatchQuery({
			['availability.availability_365']: { $gte: dateDifference },
			min_nights: { $lte: dateDifference },
			max_nights: { $gte: dateDifference },
		})
	)
	}
	if (accommodates) {
    query.push( databaseHelper.GenerateMatchQuery( 
      {	
			accommodates: { $lte: parseInt(accommodates) },
		}
    ))
	}

	// console.log(matchQuery)
	 query = [
		databaseHelper.GenerateAddFieldQuery({
			max_nights: { $toInt: '$maximum_nights' },
			min_nights: { $toInt: '$minimum_nights' },
		}),
		databaseHelper.GenerateMatchQuery({property_type}),
  ]
  if ( search ) {
    query.push(databaseHelper.GenerateSearchQuery(['name'], search))
  }
  
  const options = {
    startIndex: +startIndex,
    itemsPerPage: +itemsPerPage,
    projection: {
      listing_url: 1,
      name: 1,
      bedrooms: 1,
      host: 1,
      beds: 1,
      accommodates: 1,
      availability_365: 1,
      // minimum_nights: 1,
      // maximum_nights: 1,
      property_type: 1,
      min_nights: 1,
      max_nights: 1
    },
    query,
    sortObj:{name:1}
	}
	const response = await databaseHelper.GenerateQueryWithPagination(options, Airbnb)
	return res.json({ ...response,  })
}
