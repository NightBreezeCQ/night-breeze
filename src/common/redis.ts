import Redis from "ioredis";
import settings from "@/settings";

class Server extends Redis {

}

let redis = new Server(settings.redisConfig);

export default redis;
