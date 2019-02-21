// POST /api/returns {customerId, movieId}

// Return 401 - unauthorized (if client is not logged in)
// Return 400 - bad request (if customerId is not provided)
// Return 400 - bad request (if movieId is not provided)
// Return 404 - not found(if no rental for customerID, movieId found)
// Return 400 - bad request (if rental already processed)
// Return 200 - valid request 
//  Set the return date
//  Calculate the rental fee
//  Increase the stock
//  Return the rental, dateout, rental fee
