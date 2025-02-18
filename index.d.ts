declare global {
    namespace Express {
        interface Request {
            userId?: string,
            headers?:{
                token?: string
            }
        }
    }
}

export{};