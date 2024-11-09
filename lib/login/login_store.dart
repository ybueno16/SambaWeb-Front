import 'package:mobx/mobx.dart';
import 'package:sambaweb_front/login/data/infra/api_datasource.dart';
import 'package:sambaweb_front/login/domain/entities/login_entity.dart';

part 'login_store.g.dart';

class LoginStore = LoginStoreBase with _$LoginStore;

abstract class LoginStoreBase with Store {
  final ApiDatasource apiDatasource;

  LoginStoreBase(this.apiDatasource);

  @observable
  bool isLoading = false;

  Future<LoginEntity> login(LoginEntity login) async {
    return apiDatasource.login(login);
  }
}
