/// Erro de comunicação com a API, já com mensagem pronta para mostrar ao usuário.
class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

/// Mensagem segura para exibir na tela, qualquer que seja o erro.
String errorMessage(Object? error) {
  if (error is ApiException) return error.message;
  return 'Algo deu errado. Tente novamente.';
}
