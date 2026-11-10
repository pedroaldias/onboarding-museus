import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:museus_app/models/attraction.dart';
import 'package:museus_app/models/work.dart';
import 'package:museus_app/services/api_exception.dart';
import 'package:museus_app/services/attraction_service.dart';

const _jsonHeaders = {'content-type': 'application/json; charset=utf-8'};

AttractionService _serviceWith(MockClient client) =>
    AttractionService(client: client, baseUrl: 'http://test/api');

void main() {
  group('modelos', () {
    test('Attraction.fromJson', () {
      final a = Attraction.fromJson({'id': 1, 'name': 'Museu', 'description': 'Desc'});
      expect(a.id, 1);
      expect(a.name, 'Museu');
    });

    test('Work.fromJson lê attraction_id', () {
      final w = Work.fromJson({
        'id': 2,
        'attraction_id': 1,
        'title': 'Estátua de Anúbis',
        'author': 'Desconhecido',
        'description': 'Escultura em basalto, 500 a.C.',
      });
      expect(w.attractionId, 1);
      expect(w.title, 'Estátua de Anúbis');
    });
  });

  group('AttractionService', () {
    test('lista atrações e preserva acentos', () async {
      final service = _serviceWith(MockClient((request) async {
        expect(request.url.toString(), 'http://test/api/attraction');
        return http.Response(
          jsonEncode([
            {'id': 1, 'name': 'Museu Théo Brandão', 'description': 'Maceió'},
          ]),
          200,
          headers: _jsonHeaders,
        );
      }));

      final result = await service.fetchAttractions();
      expect(result.single.name, 'Museu Théo Brandão');
    });

    test('lista as obras da atração', () async {
      final service = _serviceWith(MockClient((request) async {
        expect(request.url.path, '/api/attraction/7/work');
        return http.Response('[]', 200, headers: _jsonHeaders);
      }));

      expect(await service.fetchWorks(7), isEmpty);
    });

    test('usa a mensagem da API em um 404', () async {
      final service = _serviceWith(MockClient((_) async => http.Response(
            jsonEncode({'message': 'Atração 9 não encontrada', 'statusCode': 404}),
            404,
            headers: _jsonHeaders,
          )));

      expect(
        service.fetchWorks(9),
        throwsA(isA<ApiException>()
            .having((e) => e.message, 'message', 'Atração 9 não encontrada')
            .having((e) => e.statusCode, 'statusCode', 404)),
      );
    });

    test('falha de rede vira mensagem amigável', () async {
      final service = _serviceWith(
        MockClient((_) async => throw http.ClientException('sem rede')),
      );

      expect(
        service.fetchAttractions(),
        throwsA(isA<ApiException>().having(
          (e) => e.message,
          'message',
          contains('Não foi possível conectar à API'),
        )),
      );
    });

    test('resposta que não é JSON vira ApiException', () async {
      final service = _serviceWith(
        MockClient((_) async => http.Response('<html>', 200, headers: _jsonHeaders)),
      );

      expect(service.fetchAttractions(), throwsA(isA<ApiException>()));
    });
  });
}
