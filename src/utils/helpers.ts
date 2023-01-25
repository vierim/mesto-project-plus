import mongoose from 'mongoose';

export default (error: mongoose.Error.ValidationError) => `${Object.values(error.errors).map((err) => err.message).join(', ')}`;
