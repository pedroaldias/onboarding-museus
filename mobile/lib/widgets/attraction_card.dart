import 'package:flutter/material.dart';

import '../models/attraction.dart';
import '../theme/app_theme.dart';

class AttractionCard extends StatelessWidget {
  const AttractionCard({
    super.key,
    required this.attraction,
    required this.onTap,
  });

  final Attraction attraction;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Material(
      color: scheme.surface,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: scheme.outlineVariant),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(attraction.name, style: serifStyle(context, 24)),
              const SizedBox(height: 8),
              Text(
                attraction.description,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: scheme.onSurfaceVariant, height: 1.4),
              ),
              const SizedBox(height: 16),
              Text(
                'Ver obras →',
                style: TextStyle(
                  color: scheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
