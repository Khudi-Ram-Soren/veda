import mongoose from "mongoose";
import dns from "dns";
dns.getServers();
dns.setServers(["1.1.1.1"]);

const MAX_RETRY = 3;
const RETRY_INTERVAL = 5000;

class DatabaseConnection {
  constructor() {
    mongoose.set("strictQuery", true);

    this.retryCount = 0;
    this.isConnected = false;
    this.isConnecting = false;

    mongoose.connection.on("connected", () => {
      console.log(`✅ database connected successfully`);
      this.isConnected = true;
      this.isConnecting = false;
    });

    mongoose.connection.on("error", () => {
      console.log(`💔 Error database connection faild`);
      this.isConnected = false;
      this.isConnecting = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log(`❌ database disconnected`);
      this.isConnected = false;
      this.handleDisconnection();
    });

    process.on("SIGINT", this.handleAppTermination.bind(this));
    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (this.isConnected || this.isConnecting) return;

      if (!process.env.MONGODB_URI) {
        throw new Error("Database URI is not defiend in env variable");
      }

      this.isConnecting = true;

      const connectionOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      };

      const res = await mongoose.connect(
        `${process.env.MONGODB_URI}/veda`,
        connectionOptions
      );

      this.retryCount = 0;
    } catch (error) {
      console.log("data base connection faild Error", error);
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRY) {
      this.retryCount++;

      console.log(
        `Retrying connection... Attemp ${this.retryCount} of ${MAX_RETRY}`
      );

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, RETRY_INTERVAL);
      });

      return this.connect();
    } else {
      console.error(`Faild to connect database after ${MAX_RETRY} attempts`);
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected && !this.isConnecting) {
      console.log(`Attempting to reconnect database`);
      this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log(`Database connection closed through app termination`);
      process.exit(0);
    } catch (error) {
      console.log(`Error during database disconnection...`);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDbStatus = dbConnection.getConnectionStatus.bind(dbConnection);
