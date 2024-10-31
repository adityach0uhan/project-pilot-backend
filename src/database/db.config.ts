import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

const connectDataBase = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log('Already Connected to Database !');
    } else {
        try {
            const db = await mongoose.connect(process.env.MONGO_URI || '');
            connection.isConnected = db.connections[0].readyState;
            console.log(' Database Connected Successfully ');
        } catch (error) {
            console.log(
                '!!!!Error occured while connecting to database !',
                error
            );
            process.exit(1);
        }
    }
};

export default connectDataBase;
