const { MongoClient } = require('mongodb');
async function main() {

    const uri = "mongodb+srv://kunasgi:kunasgi@prueba1.puqjy0g.mongodb.net/Mapel";
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate DB calls
        await createService(client,
            "guss@gmail.com",
            "Teatro de Titeres",
            [new Date('December 17, 2022 15:00:00'), new Date('December 17, 2022 17:00:00')],
            { precioPorServicio: 180 });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**isting exists with the given name, a reservation will be created for the first listing the database finds.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the Mapel database
 * @param {String} userEmail The email address of the user who is creating the reservation
 * @param {String} nameServicio The name of the Airbnb listing to be reserved
 * @param {Array.Date} dateService An array of the date(s) for the reservation
 * @param {Object} detailsService 
 */
async function createService(client, userEmail, nameServicio, dateService, detailsService) {

    const clienteCollection = client.db("Mapel").collection("cliente");
    const servicioCollection = client.db("Mapel").collection("servicio");
    const reservation = createReservationDocument(nameServicio, dateService, detailsService);
    const session = client.startSession();
    // Step 2: Optional. Define options for the transaction
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
       
        const transactionResults = await session.withTransaction(async () => {

            // Important:: You must pass the session to each of the operations   

            // Add a reservation to the reservations array for the appropriate document in the cliente collection
            const clienteUpdateResults = await clienteCollection.updateOne(
                { email: userEmail },
                { $addToSet: { reservations: reservation } },
                { session });
            console.log(`${clienteUpdateResults.matchedCount} document(s) found in the cliente collection with the email address ${userEmail}.`);
            console.log(`${clienteUpdateResults.modifiedCount} document(s) was/were updated to include the reservation.`);

            // Check if the Airbnb listing is already reserved for those dates. If so, abort the transaction.
            const isServicioReservedResults = await servicioCollection.findOne(
                { name: nameServicio, datesReserved: { $in: dateService } },
                { session });
            if (isServicioReservedResults) {
                await session.abortTransaction();
                console.error("This listing is already reserved for at least one of the given dates. The reservation could not be created.");
                console.error("Any operations that already occurred as part of this transaction will be rolled back.")
                return;
            }

            //  Add the reservation dates to the datesReserved array for the appropriate document in the listingsAndRewiews collection
            const servicioUpdateResults = await servicioCollection.updateOne(
                { name: nameServicio },
                { $addToSet: { datesReserved: { $each: dateService } } },
                { session });
            console.log(`${servicioUpdateResults.matchedCount} document(s) found in the servicio collection with the name ${nameServicio}.`);
            console.log(`${servicioUpdateResults.modifiedCount} document(s) was/were updated to include the reservation dates.`);

        }, transactionOptions);

        if (transactionResults) {
            console.log("The reservation was successfully created.");
        } else {
            console.log("The transaction was intentionally aborted.");
        }
    } catch (e) {
        console.log("The transaction was aborted due to an unexpected error: " + e);
    } finally {
        // Step 4: End the session
        await session.endSession();
    }

}
/**
 * A helper function that generates a reservation document
 * @param {String} nameServicio The name of the Airbnb listing to be reserved
 * @param {Array.Date} reservationDates An array of the date(s) for the reservation
 * @param {Object} reservationDetails An object containing additional reservation details that need to be stored with the reservation
 * @returns {Object} The reservation document
 */
 function createReservationDocument(nameServicio, reservationDates, reservationDetails) {
    // Create the reservation
    let reservation = {
        name: nameServicio,
        dates: reservationDates,
    }

    // Add additional properties from reservationDetails to the reservation
    for (let detail in reservationDetails) {
        reservation[detail] = reservationDetails[detail];
    }

    return reservation;
}