import 'package:flutter/material.dart';

import '../models/work.dart';
import '../theme/app_theme.dart';

class WorkCard extends StatelessWidget {
  const WorkCard({super.key, required this.work});

  final Work work;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(work.title, style: serifStyle(context, 20)),
          const SizedBox(height: 2),
          Text(
            'Autor: ${work.author}',
            style: TextStyle(
              color: scheme.primary,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            work.description,
            style: TextStyle(color: scheme.onSurfaceVariant, height: 1.4),
          ),
        ],
      ),
    );
  }
}
