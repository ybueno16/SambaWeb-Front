import { ISudoAuthentication } from '../../../@shared/interfaces/sudo-authentication.interface';
import { IUser } from '../../../@shared/interfaces/user.interface';

export interface ILogin {
  user: IUser;
  sudoAuthentication: ISudoAuthentication;
}
