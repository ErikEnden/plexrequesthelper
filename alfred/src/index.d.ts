import { UserData } from "./router/types/user";

declare global {
    namespace Express {
        interface Request {
            user: UserData
        }
    }
}