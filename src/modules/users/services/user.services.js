import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const createUser = async (data) =>{
    const haspassword = await bcrypt.hash(data.password, 10)
    const user = new User({...data, password: haspassword})
    return user.save()
}

export const findEmailByUser = async (email) => {
    return User.findOne({email});
}
