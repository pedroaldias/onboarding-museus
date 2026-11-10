import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/attraction.dart';
import '../models/work.dart';
import 'api_exception.dart';

/// Consumo da API (somente leitura: o app não cria nem edita dados).
class AttractionService {
  AttractionService({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        _ownsClient = client == null,
        _baseUrl = baseUrl ?? apiBaseUrl;

  final http.Client _client;
  final bool _ownsClient;
  final String _baseUrl;

  static const _timeout = Duration(seconds: 10);

  Future<List<Attraction>> fetchAttractions() async {
    final data = await _getList('/attraction');
    return data
        .map((item) => Attraction.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<Work>> fetchWorks(int attractionId) async {
    final data = await _getList('/attraction/$attractionId/work');
    return data
        .map((item) => Work.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  void dispose() {
    if (_ownsClient) _client.close();
  }

  Future<List<dynamic>> _getList(String path) async {
    final http.Response response;
    try {
      response = await _client.get(Uri.parse('$_baseUrl$path')).timeout(_timeout);
    } on TimeoutException {
      throw const ApiException(
        'A API demorou demais para responder. Tente novamente.',
      );
    } on Exception {
      throw const ApiException(
        'Não foi possível conectar à API. Verifique se o servidor está em execução.',
      );
    }

    // Decodifica os bytes como UTF-8 para não quebrar acentos.
    final body = utf8.decode(response.bodyBytes);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        _messageFromBody(body) ?? 'Erro ${response.statusCode}',
        statusCode: response.statusCode,
      );
    }

    try {
      return jsonDecode(body) as List<dynamic>;
    } on Object {
      throw const ApiException('Resposta inválida da API.');
    }
  }

  /// A API (NestJS) devolve `message` como texto ou como lista de textos.
  String? _messageFromBody(String body) {
    try {
      final json = jsonDecode(body);
      if (json is Map<String, dynamic>) {
        final message = json['message'];
        if (message is String) return message;
        if (message is List) return message.join(', ');
      }
    } on Object {
      // corpo sem JSON: usa a mensagem padrão
    }
    return null;
  }
}
