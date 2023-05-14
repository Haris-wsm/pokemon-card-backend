const SocketModel = require("../models/socket-client");

module.exports = (socket, io) => {
  // Listen for the 'store-client' event sent by the client
  socket.on("store-client", async (data) => {
    // Check if a document with the same paymentId already exists
    try {
      const doc = await SocketModel.findOne({ paymentId: data.paymentId });

      if (doc) {
        // If a document already exists, update the clientId field
        doc.clientId = socket.id;
        await doc.save();
        console.log(
          `Updated client ID ${socket.id} for payment ID ${data.paymentId}`
        );
      } else {
        // If no document exists, create a new one
        const paymentClient = new SocketModel({
          paymentId: data.paymentId,
          clientId: socket.id,
        });
        await paymentClient.save();
        console.log(
          `Stored client ID ${socket.id} for payment ID ${data.paymentId}`
        );
      }
    } catch (err) {
      console.error(`Error finding/updating/storing client ID: ${err}`);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const doc = await SocketModel.findOneAndDelete({ clientId: socket.id });
      if (!doc) {
        console.log(`No client ID found for disconnected client ${socket.id}`);
      } else {
        console.log(
          `Deleted client ID ${socket.id} for payment ID ${doc.paymentId}`
        );
      }
    } catch (err) {
      console.error(`Error deleting client ID: ${err}`);
    }
  });
};
