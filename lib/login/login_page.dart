import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:sambaweb_front/commons/domain/entities/sudo_authentication_entity.dart';
import 'package:sambaweb_front/commons/domain/entities/user_entity.dart';
import 'package:sambaweb_front/login/data/infra/api_datasource.dart';
import 'package:sambaweb_front/login/domain/entities/login_entity.dart';
import 'package:sambaweb_front/login/login_presenter.dart';
import 'package:sambaweb_front/login/login_store.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _userController = TextEditingController();
  final _passwordController = TextEditingController();
  late Dio _dio;
  late ApiDatasource _apiDatasource;
  late LoginStore _loginStore;
  late LoginPresenter _loginPresenter;

  @override
  void initState() {
    super.initState();
    _dio = Dio();
    _apiDatasource = ApiDatasource(_dio);
    _loginStore = LoginStore(_apiDatasource);
    _loginPresenter = LoginPresenter(_loginStore);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.3,
                child: TextField(
                  key: Key("user-login"),
                  controller: _userController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: "Login"),
                ),
              ),
              Padding(padding: EdgeInsets.all(8)),
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.3,
                child: TextField(
                  key: Key("password-login"),
                  controller: _passwordController,
                  decoration: InputDecoration(
                      border: OutlineInputBorder(), labelText: "Password"),
                  obscureText: true,
                ),
              ),
              OutlinedButton(
                onPressed: () {
                  final login = LoginEntity(
                    user: UserEntity(
                      user: _userController.text,
                      password: '',
                    ),
                    sudoAuthentication: SudoAuthenticationEntity(
                      sudoPassword: _passwordController.text,
                    ),
                  );
                  _loginPresenter.login(login);
                },
                child: Text("Login"),
              )
            ],
          ),
        ),
      ),
    );
  }
}
