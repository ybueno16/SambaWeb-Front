class SudoAuthenticationEntity {
  final String sudoPassword;
  final String? sudoUser;

  SudoAuthenticationEntity({required this.sudoPassword, this.sudoUser});

  factory SudoAuthenticationEntity.fromJson(Map<String, dynamic> json) {
    return SudoAuthenticationEntity(
      sudoPassword: json['sudoPassword'],
      sudoUser: json['sudoUser'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sudoPassword': sudoPassword,
      'sudoUser': sudoUser,
    };
  }
}
