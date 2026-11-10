import 'package:flutter/material.dart';

import '../models/attraction.dart';
import '../models/work.dart';
import '../services/api_exception.dart';
import '../services/attraction_service.dart';
import '../theme/app_theme.dart';
import '../widgets/empty_view.dart';
import '../widgets/error_view.dart';
import '../widgets/loading_view.dart';
import '../widgets/work_card.dart';

/// Obras de uma atração (somente leitura).
class WorksScreen extends StatefulWidget {
  const WorksScreen({super.key, required this.attraction, this.service});

  final Attraction attraction;
  final AttractionService? service;

  @override
  State<WorksScreen> createState() => _WorksScreenState();
}

class _WorksScreenState extends State<WorksScreen> {
  late final AttractionService _service = widget.service ?? AttractionService();
  late Future<List<Work>> _future = _service.fetchWorks(widget.attraction.id);

  @override
  void dispose() {
    if (widget.service == null) _service.dispose();
    super.dispose();
  }

  Future<void> _reload() async {
    final future = _service.fetchWorks(widget.attraction.id);
    setState(() => _future = future);
    try {
      await future;
    } on Object {
      // o erro já é exibido pelo FutureBuilder
    }
  }

  List<Widget> _content(AsyncSnapshot<List<Work>> snapshot) {
    if (snapshot.connectionState != ConnectionState.done) {
      return const [LoadingView()];
    }
    if (snapshot.hasError) {
      return [ErrorView(message: errorMessage(snapshot.error), onRetry: _reload)];
    }
    final works = snapshot.data ?? const <Work>[];
    if (works.isEmpty) {
      return const [
        EmptyView(title: 'Nenhuma obra cadastrada nesta atração.'),
      ];
    }
    return [
      for (final work in works)
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: WorkCard(work: work),
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: RefreshIndicator(
              onRefresh: _reload,
              child: FutureBuilder<List<Work>>(
                future: _future,
                builder: (context, snapshot) {
                  return ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                    children: [
                      Text(widget.attraction.name, style: serifStyle(context, 34)),
                      const SizedBox(height: 12),
                      Text(
                        widget.attraction.description,
                        style: TextStyle(
                          color: scheme.onSurfaceVariant,
                          fontSize: 16,
                          height: 1.45,
                        ),
                      ),
                      const SizedBox(height: 28),
                      Text('Obras', style: serifStyle(context, 26)),
                      const SizedBox(height: 12),
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
