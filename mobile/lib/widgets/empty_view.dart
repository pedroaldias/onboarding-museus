import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class EmptyView extends StatelessWidget {
  const EmptyView({super.key, required this.title, this.description});

  final String title;
  final String? description;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: scheme.outline),
      ),
      child: Column(
        children: [
          Icon(Icons.account_balance_outlined, size: 40, color: scheme.primary),
          const SizedBox(height: 12),
          Text(title, textAlign: TextAlign.center, style: serifStyle(context, 20)),
          if (description != null) ...[
            const SizedBox(height: 6),
            Text(
              description!,
              textAlign: TextAlign.center,
              style: TextStyle(color: scheme.onSurfaceVariant),
            ),
          ],
        ],
      ),
    );
  }
}
