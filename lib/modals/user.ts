import mongoose, { Schema, Document, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Kullanıcı arayüzü
export interface IUser extends Document {
  userName: string;
  password: string;
  role: 'admin' | 'user';
  comparePassword(password: string): Promise<boolean>;
}

// Kullanıcı şeması
const UserSchema: Schema<IUser> = new Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
  timestamps: true
});

// Şifreyi hashleme
UserSchema.pre<IUser>('save', async function (next) {
  console.log('Hashlenmeden Önceki Şifre:', this.password);
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Yeni Hashlenmiş Şifre:', hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Şifre karşılaştırma
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, this.password);

    console.log('Girilen Şifre:', password);
    console.log('Hashlenmiş Şifre:', this.password);
    console.log('Password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Şifre karşılaştırma hatası:', error);
    return false;
  }
};

// Modeli oluşturma
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
