import 'package:dio/dio.dart';
import 'package:sambaweb_front/commons/api_config.dart';
import 'package:sambaweb_front/config/routes.dart';
import 'package:sambaweb_front/login/domain/entities/login_entity.dart';

class ApiDatasource {
  final Dio _dio;

  ApiDatasource(this._dio);

  Future<LoginEntity> login(LoginEntity login) async {
    String baseUrl = await ApiConfig.getBaseUrl();
    print('${baseUrl}/${Routes.login}');
    Response response =
        await _dio.post('${baseUrl}/${Routes.login}', data: login.toJson());

    if (response.statusCode == 200) {
      print('Login ok');
      return LoginEntity.fromJson(response.data);
    } else {
      throw Exception('Error while login');
    }
  }
}
