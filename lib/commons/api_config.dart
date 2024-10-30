import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sambaweb_front/config/routes.dart';

class ApiConfig {
  Routes routes = Routes();
  static Future<String> getBaseUrl() async {
    await dotenv.load(fileName: '.env');

    String? ip = dotenv.env['IP'];
    String? port = dotenv.env['PORT'];
    String? baseApi = dotenv.env['BASE_API'];
    String baseUrl = 'http://$ip:$port/$baseApi';
    return baseUrl;
  }
}

