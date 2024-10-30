class UserEntity {
  final String user;
  final String password;

  UserEntity({required this.user, required this.password});

  factory UserEntity.fromJson(Map<String, dynamic> json) {
    return UserEntity(user: json['user'], password: json['password']);
  }

  Map<String, dynamic> toJson() {
    return {'user': user, 'password': password};
  }
}
