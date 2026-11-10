import 'package:flutter/material.dart';

import '../models/attraction.dart';
import '../services/api_exception.dart';
import '../services/attraction_service.dart';
import '../theme/app_theme.dart';
import '../widgets/attraction_card.dart';
import '../widgets/empty_view.dart';
import '../widgets/error_view.dart';
import '../widgets/loading_view.dart';
import 'works_screen.dart';

/// Tela inicial: lista de atrações. Tocar em uma abre as obras dela.
class AttractionsScreen extends StatefulWidget {
  const AttractionsScreen({super.key, this.service});

  /// Injetável para testes; em produção o próprio widget cria o serviço.
  final AttractionService? service;

  @override
  State<AttractionsScreen> createState() => _AttractionsScreenState();
}

class _AttractionsScreenState extends State<AttractionsScreen> {
  late final AttractionService _service = widget.service ?? AttractionService();
  late Future<List<Attraction>> _future = _service.fetchAttractions();

  @override
  void dispose() {
    if (widget.service == null) _service.dispose();
    super.dispose();
  }

  Future<void> _reload() async {
    final future = _service.fetchAttractions();
    setState(() => _future = future);
    try {
      await future; // mantém o indicador do "puxar para atualizar" até terminar
    } on Object {
      // o erro já é exibido pelo FutureBuilder
    }
  }

  void _open(Attraction attraction) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => WorksScreen(attraction: attraction, service: _service),
      ),
    );
  }

  List<Widget> _content(AsyncSnapshot<List<Attraction>> snapshot) {
    if (snapshot.connectionState != ConnectionState.done) {
      return const [LoadingView()];
    }
    if (snapshot.hasError) {
      return [ErrorView(message: errorMessage(snapshot.error), onRetry: _reload)];
    }
    final items = snapshot.data ?? const <Attraction>[];
    if (items.isEmpty) {
      return const [
        EmptyView(
          title: 'Nenhuma atração cadastrada ainda.',
          description: 'Cadastre museus pela plataforma web para vê-los aqui.',
        ),
      ];
    }
    return [
      for (final attraction in items)
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: AttractionCard(
            attraction: attraction,
            onTap: () => _open(attraction),
          ),
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: Text('Acervo', style: serifStyle(context, 24))),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: RefreshIndicator(
              onRefresh: _reload,
              child: FutureBuilder<List<Attraction>>(
                future: _future,
                builder: (context, snapshot) {
                  return ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                    children: [
                      Text('Atrações', style: serifStyle(context, 36)),
                      const SizedBox(height: 8),
                      Text(
                        'Toque em uma atração para ver as obras do acervo.',
                        style: TextStyle(
                          color: scheme.onSurfaceVariant,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ..._content(snapshot),
                    ],
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
