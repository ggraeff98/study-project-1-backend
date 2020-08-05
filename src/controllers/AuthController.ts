import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../schemas/User';
import { IError } from '../shared/interfaces/Errors';
import { IUserLogin } from '../shared/interfaces/User';
import ErrorsCode from '../shared/models/ErrorsCode';

class AuthController {
  public async login(req: Request, res: Response) {
    const { email, password }: IUserLogin = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        const error: IError = {
          name: 'User not found!',
          message: 'An user with this email could not be found!'
        };
        return res.status(ErrorsCode.ERROR_NOT_FOUND).json(error);
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
        const error: IError = {
          name: 'Login error!',
          message: 'Invalid password!'
        };
        return res.status(ErrorsCode.ERROR_ON_VALIDATE_DATA).json(error);
      }

      return res.status(200).json(user);
    } catch (err) {
      const error: IError = {
        name: 'Database error!',
        message: 'An ocurred when accessing database!'
      };

      if (!email || !password) {
        error.requestError = 'Missing email or password on request body!';
        return res.status(ErrorsCode.ERROR_ON_VALIDATE_DATA).json(error);
      }

      return res.status(ErrorsCode.ERROR_NOT_FOUND).json(error);
    }
  }
}

export default new AuthController();