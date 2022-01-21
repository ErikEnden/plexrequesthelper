declare namespace NodeJS {
    export interface ProcessEnv {
        TESTUSER_LOGIN: string,
        TESTUSER_PASSWORD: string,
        TESTUSER_NAME: string,
        JWT_SECRET_KEY: string,
        API_PREFIX: string
    }
}