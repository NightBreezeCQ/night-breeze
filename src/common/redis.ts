import Redis from "ioredis";
import envConfig from "@/config/envConfig";

class Server extends Redis {

}
let redis: Server;

redis = new Server(envConfig.redisConfig);

export default redis;
