import 'package:sambaweb_front/login/domain/entities/login_entity.dart';
import 'package:sambaweb_front/login/login_store.dart';

class LoginPresenter {
  final LoginStore _store;

  LoginPresenter(this._store);

  Future<LoginEntity> login(LoginEntity login) async {
    _store.isLoading = true;
    try {
      final userLogin = await _store.login(login);
      return userLogin;
    } catch (e) {
      rethrow;
    } finally {
      _store.isLoading = false;
    }
  }
}
