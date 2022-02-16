// const { Pool } = require("pg");
// const dbParams = require("./lib/db.js");
// const db = new Pool(dbParams);
// db.connect();
// /// Users

// /**
//  * Get a single user from the database given their email.
//  * @param {String} email The email of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */

// const getUserWithEmail = function (email) {
//   const value = email.toLowerCase();
//   return pool
//     .query(`SELECT * FROM users WHERE email = $1`, [value])
//     .then(result => {
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });
// }

// exports.getUserWithEmail = getUserWithEmail;

// /**
//  * Get a single user from the database given their id.
//  * @param {string} id The id of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */

// const getUserWithId = function (id) {
//   return pool
//     .query(`SELECT * FROM users WHERE id = $1`, [id])
//     .then(result => {
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });
// }
// exports.getUserWithId = getUserWithId;


// /**
//  * Add a new user to the database.
//  * @param {{name: string, password: string, email: string}} user
//  * @return {Promise<{}>} A promise to the user.
//  */


// const addUser = function (user) {
//   const queryString = `INSERT INTO users(name, email, password)
//   VALUES ($1, $2, $3) RETURNING *;`
//   const values = [user.name, user.email, user.password];

//   return pool
//     .query(queryString, values)
//     .then(result => {
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });
// }

// exports.addUser = addUser;

// /// Reservations

// /**
//  * Get all reservations for a single user.
//  * @param {string} guest_id The id of the user.
//  * @return {Promise<[{}]>} A promise to the reservations.
//  */
// const getAllReservations = function (guest_id, limit = 10) {
//   // return getAllProperties(null, 2);
//   const queryString = `SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
//   FROM reservations
//   JOIN properties ON reservations.property_id = properties.id
//   JOIN property_reviews ON property_reviews.property_id = properties.id
//   WHERE reservations.guest_id = $1
//   AND reservations.end_date < now()::date
//   GROUP BY properties.id, reservations.id
//   ORDER BY reservations.start_date
//   LIMIT $2;`;
//   const value = [guest_id, limit];

//   return pool
//     .query(queryString, value)
//     .then(result => {
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });

// }
// exports.getAllReservations = getAllReservations;

// /// Properties

// /**
//  * Get all properties.
//  * @param {{}} options An object containing query options.
//  * @param {*} limit The number of results to return.
//  * @return {Promise<[{}]>}  A promise to the properties.
//  */

// const getAllProperties = (options, limit = 10) => {

//   const queryParams = [];
//   let queryString = `
// SELECT properties.*, avg(property_reviews.rating) as average_rating
// FROM properties
// JOIN property_reviews ON properties.id = property_reviews.property_id
// WHERE properties.id IS NOT NULL
// `;

//   //convert city input to titlecase to match database entires
//   function titleCase(city) {
//     let citySplit = city.toLowerCase().split(' ');
//     for (let i = 0; i < citySplit.length; i++) {
//       citySplit[i] = citySplit[i].charAt(0).toUpperCase() + citySplit[i].substring(1);
//     }
//     return citySplit.join(' ');
//   }

//   //validate that the key exists and then add on to the query
//   if (!options.city == "") {
//     let titleCaseCityName = titleCase(options.city);
//     queryParams.push(`%${titleCaseCityName}%`);
//     queryString += `AND properties.city LIKE $${queryParams.length} `;

//   }

//   if (!options.minimum_price_per_night == "") {
//     const minPriceInCents = options.minimum_price_per_night * 100;
//     queryParams.push(minPriceInCents);
//     queryString += `AND properties.cost_per_night >= $${queryParams.length} `;

//   }

//   if (!options.maximum_price_per_night == "") {
//     const maxPriceInCents = options.maximum_price_per_night * 100;
//     queryParams.push(maxPriceInCents);
//     queryString += `AND properties.cost_per_night <= $${queryParams.length} `;

//   }

//   if (!options.minimum_rating == "") {
//     queryParams.push(options.minimum_rating);
//     queryString += `AND property_reviews.rating >= $${queryParams.length} `;

//   }
//   if (!options.owner_id == "") {
//     queryParams.push(`%${options.owner_id}%`);
//     queryString += `AND properties.owner_id = $${queryParams.length} `;

//   }

//   //add on the limit as the final filter
//   queryParams.push(limit);
//   queryString += `GROUP BY properties.id LIMIT $${queryParams.length};`;

//   return pool
//     .query(queryString, queryParams)
//     .then(result => {
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };
// exports.getAllProperties = getAllProperties;


// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function (property) {
  
// const queryString =`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
// VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;

// let userID = parseInt(property.owner_id);
// let parkingSpaces = parseInt(property.parking_spaces); 
// let bathroomNumber = parseInt(property.number_of_bathrooms);
// let bedroomNumber = parseInt(property.number_of_bedrooms);

// const values = [
//   userID, 
//   property.title,
//   property.description,
//   property.thumbnail_photo_url, 
//   property.cover_photo_url,
//   property.cost_per_night,
//   parkingSpaces, 
//   bathroomNumber,
//   bedroomNumber,
//   property.country,
//   property.street,
//   property.city,
//   property.province,
//   property.post_code,
//   ];

//   return pool
//     .query(queryString, values)
//     .then(result => {
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//       return null;
//     });
// }
// exports.addProperty = addProperty;
