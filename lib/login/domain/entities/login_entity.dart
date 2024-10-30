import 'package:sambaweb_front/commons/domain/entities/sudo_authentication_entity.dart';
import 'package:sambaweb_front/commons/domain/entities/user_entity.dart';

class LoginEntity {
  final UserEntity user;
  final SudoAuthenticationEntity sudoAuthentication;

  LoginEntity({required this.user, required this.sudoAuthentication});

  factory LoginEntity.fromJson(Map<String, dynamic> json) {
    return LoginEntity(
      user: UserEntity.fromJson(json['user']),
      sudoAuthentication:
          SudoAuthenticationEntity.fromJson(json['sudoAuthentication']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': user.toJson(),
      'sudoAuthentication': sudoAuthentication.toJson(),
    };
  }
}
