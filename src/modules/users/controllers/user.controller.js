import * as userService from '../services/user.services.js'

export const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({message: "user created", user})
    } catch (error) {
        next(error)
    }
}

export const get = async (req, res, next) => {
  try {
    // assuming middleware added user info to req.user
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await userService.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // avoid sending password in response
    const { password, ...userData } = user.toObject();
    res.status(200).json({ user: userData });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({"message":"Unauthorise"});
        const updatedUser = await userService.updateUser(userId, req.body);
        if(!updatedUser) return res.status(404).json({"message":"User not found."});

        // Convert to plain object safely (Mongoose doc or raw object)
        const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
        const { password, ...userData } = userObj;

        res.status(200).json({message: "Profile updated successfully", user: userData});
    } catch (error) {
        next(error);
    }
 }
