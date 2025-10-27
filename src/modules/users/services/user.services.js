import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const createUser = async (data) =>{
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    const haspassword = await bcrypt.hash(data.password, 10)
    const user = new User({...data, password: haspassword})
    return user.save()
}

export const findById = async (id) => {
  return User.findById(id);
};

export const findEmailByUser = async (email) => {
    return User.findOne({email});
}

export const updateUser = async (id, data) => {
    return User.findByIdAndUpdate(id, data, { new: true });
}
