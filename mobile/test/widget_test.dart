import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:museus_app/screens/attractions_screen.dart';
import 'package:museus_app/services/attraction_service.dart';

const _jsonHeaders = {'content-type': 'application/json; charset=utf-8'};

AttractionService _service(MockClient client) =>
    AttractionService(client: client, baseUrl: 'http://test/api');

void main() {
  testWidgets('lista as atrações e abre as obras ao tocar', (tester) async {
    final client = MockClient((request) async {
      if (request.url.path == '/api/attraction') {
        return http.Response(
          jsonEncode([
            {'id': 1, 'name': 'Museu Théo Brandão', 'description': 'Maceió'},
          ]),
          200,
          headers: _jsonHeaders,
        );
      }
      if (request.url.path == '/api/attraction/1/work') {
        return http.Response(
          jsonEncode([
            {
              'id': 1,
              'attraction_id': 1,
              'title': 'Estátua de Anúbis',
              'author': 'Desconhecido',
              'description': 'Escultura em basalto, 500 a.C.',
            },
          ]),
          200,
          headers: _jsonHeaders,
        );
      }
      return http.Response('{}', 404, headers: _jsonHeaders);
    });

    await tester.pumpWidget(
      MaterialApp(home: AttractionsScreen(service: _service(client))),
    );
    await tester.pumpAndSettle();

    expect(find.text('Museu Théo Brandão'), findsOneWidget);

    await tester.tap(find.text('Museu Théo Brandão'));
    await tester.pumpAndSettle();

    expect(find.text('Estátua de Anúbis'), findsOneWidget);
    expect(find.text('Autor: Desconhecido'), findsOneWidget);
  });

  testWidgets('mostra o estado vazio quando não há atrações', (tester) async {
    final client = MockClient(
      (_) async => http.Response('[]', 200, headers: _jsonHeaders),
    );

    await tester.pumpWidget(
      MaterialApp(home: AttractionsScreen(service: _service(client))),
    );
    await tester.pumpAndSettle();

    expect(find.text('Nenhuma atração cadastrada ainda.'), findsOneWidget);
  });

  testWidgets('mostra o erro e permite tentar novamente', (tester) async {
    var calls = 0;
    final client = MockClient((_) async {
      calls++;
      if (calls == 1) throw http.ClientException('sem rede');
      return http.Response(
        jsonEncode([
          {'id': 1, 'name': 'Museu Théo Brandão', 'description': 'Maceió'},
        ]),
        200,
        headers: _jsonHeaders,
      );
    });

    await tester.pumpWidget(
      MaterialApp(home: AttractionsScreen(service: _service(client))),
    );
    await tester.pumpAndSettle();

    expect(find.textContaining('Não foi possível conectar'), findsOneWidget);

    await tester.tap(find.text('Tentar novamente'));
    await tester.pumpAndSettle();

    expect(find.text('Museu Théo Brandão'), findsOneWidget);
  });
}
