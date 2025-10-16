import * as userService from '../services/user.services.js'

export const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({message: "user created", user})
    } catch (error) {
        next(error)
    }
}

export const getProfile = async (req, res, next) => {
    try {
        // todo
    } catch (error) {
        next(error)
    }
}
