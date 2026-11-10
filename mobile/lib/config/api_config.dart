/// Endereço base da API. Troque sem mexer no código, na hora de rodar:
///
///   Chrome ............ flutter run -d chrome
///   Emulador Android .. flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
///   iPhone/celular .... flutter run --dart-define=API_BASE_URL=http://IP_DO_PC:3000/api
const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000/api',
);
