declare namespace NodeJS {
    export interface ProcessEnv {
        TESTUSER_EMAIL: string,
        TESTUSER_PASSWORD: string,
        TESTUSER_NAME: string,
        JWT_SECRET_KEY: string
    }
}