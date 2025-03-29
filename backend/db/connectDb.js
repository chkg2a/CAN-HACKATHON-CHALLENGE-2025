import mongoose from "mongoose";

const connectDb=async()=>{
     try {
        const con=await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDb connected: ${con.connection.host}`);
     } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
     }

}

export default connectDb;